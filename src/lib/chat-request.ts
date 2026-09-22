import { z } from 'zod';
import type { ChatLocale } from './chat-errors';

const MAX_HISTORY = 12;
const MAX_USER_CHARS = 2000;
const MAX_ASSISTANT_CHARS = 4000;

const bodySchema = z.object({
  locale: z.enum(['pt-BR', 'en']).optional(),
  messages: z.array(z.unknown()).max(24),
});

const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  parts: z.array(z.unknown()).max(30).optional(),
});

const textPartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

export type ChatTurn = {
  role: 'user' | 'assistant';
  text: string;
};

export type ParsedChatRequest =
  { ok: true; locale: ChatLocale; messages: ChatTurn[] } | { ok: false };

function cleanText(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\u0000/g, '')
    .trim();
}

function textFromParts(parts: unknown[]): string {
  const lines: string[] = [];

  for (const part of parts) {
    const parsed = textPartSchema.safeParse(part);
    if (parsed.success) {
      lines.push(parsed.data.text);
    }
  }

  return cleanText(lines.join('\n'));
}

export function parseChatRequest(payload: unknown): ParsedChatRequest {
  const body = bodySchema.safeParse(payload);
  if (!body.success) {
    return { ok: false };
  }

  const turns: ChatTurn[] = [];

  for (const item of body.data.messages) {
    const parsed = messageSchema.safeParse(item);
    if (!parsed.success || parsed.data.role === 'system') {
      continue;
    }

    const text = textFromParts(parsed.data.parts ?? []);
    if (!text) {
      continue;
    }

    if (parsed.data.role === 'user' && text.length > MAX_USER_CHARS) {
      return { ok: false };
    }

    turns.push({
      role: parsed.data.role,
      text:
        parsed.data.role === 'assistant'
          ? text.slice(0, MAX_ASSISTANT_CHARS)
          : text,
    });
  }

  const messages = turns.slice(-MAX_HISTORY);
  const latest = messages[messages.length - 1];
  if (!latest || latest.role !== 'user') {
    return { ok: false };
  }

  return {
    ok: true,
    locale: body.data.locale ?? 'pt-BR',
    messages,
  };
}
