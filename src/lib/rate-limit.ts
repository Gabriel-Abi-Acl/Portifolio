import 'server-only';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { CHAT_LIMIT } from './chat-errors';
import { readServerEnv } from './server-env';

const MAX_KEYS = 5000;

const hits = new Map<string, number[]>();

let cachedKey = '';
let cachedLimiter: Ratelimit | null = null;
let notedConfig = false;
let notedOutage = false;

export type ChatLimitDecision = {
  allowed: boolean;
  retryAfterSeconds: number;
};

function warnOnce(flag: 'config' | 'outage', message: string) {
  if (flag === 'config') {
    if (notedConfig) return;
    notedConfig = true;
  } else {
    if (notedOutage) return;
    notedOutage = true;
  }
  console.warn(message);
}

function retryAfter(resetAtMs: number, now = Date.now()): number {
  const cap = Math.ceil(CHAT_LIMIT.windowMs / 1000);
  const seconds = Math.ceil((resetAtMs - now) / 1000);
  if (!Number.isFinite(seconds)) {
    return cap;
  }
  return Math.min(cap, Math.max(1, seconds));
}

function readUpstash(): { url: string; token: string } | null {
  const url = readServerEnv('UPSTASH_REDIS_REST_URL');
  const token = readServerEnv('UPSTASH_REDIS_REST_TOKEN');
  if (!url && !token) {
    return null;
  }

  if (!url || !token) {
    warnOnce(
      'config',
      '[chat] Set both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. Using the in-memory rate limit.',
    );
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    warnOnce(
      'config',
      '[chat] UPSTASH_REDIS_REST_URL is not a URL. Using the in-memory rate limit.',
    );
    return null;
  }

  if (parsed.protocol !== 'https:') {
    warnOnce(
      'config',
      '[chat] UPSTASH_REDIS_REST_URL must use https. Using the in-memory rate limit.',
    );
    return null;
  }

  return { url, token };
}

function upstashLimiter(): Ratelimit | null {
  const creds = readUpstash();
  if (!creds) {
    return null;
  }

  const key = `${creds.url}\n${creds.token}`;
  if (cachedLimiter && cachedKey === key) {
    return cachedLimiter;
  }

  cachedKey = key;
  cachedLimiter = new Ratelimit({
    redis: new Redis({ url: creds.url, token: creds.token }),
    limiter: Ratelimit.slidingWindow(CHAT_LIMIT.requests, CHAT_LIMIT.window),
    prefix: 'portfolio:chat',
    analytics: false,
  });

  return cachedLimiter;
}

function prune(now: number) {
  for (const [key, stamps] of hits) {
    const fresh = stamps.filter((stamp) => now - stamp < CHAT_LIMIT.windowMs);
    if (fresh.length === 0) {
      hits.delete(key);
    } else if (fresh.length !== stamps.length) {
      hits.set(key, fresh);
    }
  }
}

function allowInMemory(id: string): ChatLimitDecision {
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter(
    (stamp) => now - stamp < CHAT_LIMIT.windowMs,
  );

  if (recent.length >= CHAT_LIMIT.requests) {
    hits.set(id, recent);
    const oldest = recent[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: retryAfter(oldest + CHAT_LIMIT.windowMs, now),
    };
  }

  if (!hits.has(id) && hits.size >= MAX_KEYS) {
    prune(now);
    if (!hits.has(id) && hits.size >= MAX_KEYS) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(CHAT_LIMIT.windowMs / 1000),
      };
    }
  }

  recent.push(now);
  hits.set(id, recent);
  return { allowed: true, retryAfterSeconds: 0 };
}

function firstAddress(value: string | null): string {
  if (!value) {
    return '';
  }

  const first = value.split(',')[0]?.trim() ?? '';
  if (!first || first.length > 128 || /\s/.test(first)) {
    return '';
  }

  return first;
}

export function clientIp(request: Request): string {
  return (
    firstAddress(request.headers.get('x-forwarded-for')) ||
    firstAddress(request.headers.get('x-real-ip')) ||
    'unknown'
  );
}

export async function allowChatRequest(ip: string): Promise<ChatLimitDecision> {
  const limiter = upstashLimiter();
  const id = `chat:${ip}`;

  if (limiter) {
    try {
      const result = await limiter.limit(id);
      return {
        allowed: result.success,
        retryAfterSeconds: result.success ? 0 : retryAfter(result.reset),
      };
    } catch {
      warnOnce(
        'outage',
        '[chat] Upstash rate limit unavailable. Using the in-memory limit.',
      );
    }
  }

  return allowInMemory(id);
}
