import 'server-only';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { CHAT_LIMIT } from './chat-errors';
import { readServerEnv } from './server-env';

const hits = new Map<string, number[]>();

let cachedKey = '';
let cachedLimiter: Ratelimit | null = null;

function upstashLimiter(): Ratelimit | null {
  const url = readServerEnv('UPSTASH_REDIS_REST_URL');
  const token = readServerEnv('UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) {
    return null;
  }

  const key = `${url}\n${token}`;
  if (cachedLimiter && cachedKey === key) {
    return cachedLimiter;
  }

  cachedKey = key;
  cachedLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(CHAT_LIMIT.requests, CHAT_LIMIT.window),
    prefix: 'portfolio:chat',
    analytics: false,
  });

  return cachedLimiter;
}

function allowInMemory(id: string): boolean {
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter(
    (stamp) => now - stamp < CHAT_LIMIT.windowMs,
  );

  if (recent.length >= CHAT_LIMIT.requests) {
    hits.set(id, recent);
    return false;
  }

  recent.push(now);
  hits.set(id, recent);

  if (hits.size > 5000) {
    for (const [key, stamps] of hits) {
      const fresh = stamps.filter((stamp) => now - stamp < CHAT_LIMIT.windowMs);
      if (fresh.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, fresh);
      }
    }
  }

  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) {
      return first.slice(0, 128);
    }
  }

  const real = request.headers.get('x-real-ip')?.trim();
  if (real) {
    return real.slice(0, 128);
  }

  return 'unknown';
}

export async function allowChatRequest(ip: string): Promise<boolean> {
  const limiter = upstashLimiter();
  const id = `chat:${ip}`;

  if (limiter) {
    try {
      const { success } = await limiter.limit(id);
      return success;
    } catch {
      console.warn(
        '[chat] Upstash rate limit unavailable. Using the in-memory limit.',
      );
    }
  }

  return allowInMemory(id);
}
