import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import { loadKnowledgeChunks, loadPerson } from '@/content/load';
import {
  CHAT_ERROR_CODE,
  chatErrorMessage,
  type ChatErrorCode,
  type ChatLocale,
} from '@/lib/chat-errors';
import { parseChatRequest } from '@/lib/chat-request';
import { geminiLanguageModel } from '@/lib/gemini';
import { buildChatInstructions } from '@/lib/knowledge-prompt';
import { presentEmail, presentHref } from '@/lib/links';
import { allowChatRequest, clientIp } from '@/lib/rate-limit';
import { isGeminiConfigured } from '@/lib/server-env';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_BODY_BYTES = 100_000;

function chatError(
  status: number,
  locale: ChatLocale,
  code: ChatErrorCode,
  extraHeaders?: Record<string, string>,
) {
  return Response.json(
    { code, error: chatErrorMessage(locale, code) },
    {
      status,
      headers: { 'cache-control': 'no-store', ...extraHeaders },
    },
  );
}

function localeFromPayload(payload: unknown): ChatLocale {
  if (
    payload &&
    typeof payload === 'object' &&
    'locale' in payload &&
    payload.locale === 'en'
  ) {
    return 'en';
  }
  return 'pt-BR';
}

function rateLimited(locale: ChatLocale, retryAfterSeconds: number) {
  return chatError(429, locale, CHAT_ERROR_CODE.rateLimited, {
    'retry-after': String(retryAfterSeconds),
  });
}

export async function POST(request: Request) {
  const decision = await allowChatRequest(clientIp(request));

  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return decision.allowed
      ? chatError(400, 'pt-BR', CHAT_ERROR_CODE.invalid)
      : rateLimited('pt-BR', decision.retryAfterSeconds);
  }

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return decision.allowed
        ? chatError(400, 'pt-BR', CHAT_ERROR_CODE.invalid)
        : rateLimited('pt-BR', decision.retryAfterSeconds);
    }
    payload = JSON.parse(raw) as unknown;
  } catch {
    return decision.allowed
      ? chatError(400, 'pt-BR', CHAT_ERROR_CODE.invalid)
      : rateLimited('pt-BR', decision.retryAfterSeconds);
  }

  const localeHint = localeFromPayload(payload);
  if (!decision.allowed) {
    return rateLimited(localeHint, decision.retryAfterSeconds);
  }

  const parsed = parseChatRequest(payload);
  if (!parsed.ok) {
    return chatError(400, localeHint, CHAT_ERROR_CODE.invalid);
  }

  const { locale, messages } = parsed;

  if (!isGeminiConfigured()) {
    return chatError(503, locale, CHAT_ERROR_CODE.missingKey);
  }

  const model = geminiLanguageModel();
  if (!model) {
    return chatError(503, locale, CHAT_ERROR_CODE.missingKey);
  }

  const person = loadPerson();
  const instructions = buildChatInstructions({
    locale,
    displayName: person.displayName,
    contactEmail: presentEmail(person.contactEmail) ?? '',
    socials: person.socials.flatMap((social) => {
      const label = social.label.trim();
      const safe = presentHref(social.href);
      if (!label || !safe) {
        return [];
      }
      return [{ label, href: safe.href }];
    }),
    chunks: loadKnowledgeChunks(),
  });

  const uiMessages: UIMessage[] = messages.map((message, index) => ({
    id: `h-${index}`,
    role: message.role,
    parts: [{ type: 'text', text: message.text }],
  }));

  try {
    const result = streamText({
      model,
      instructions,
      messages: await convertToModelMessages(uiMessages),
      temperature: 0.2,
      maxOutputTokens: 700,
      abortSignal: request.signal,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        sendReasoning: false,
        onError: () =>
          JSON.stringify({
            code: CHAT_ERROR_CODE.unavailable,
            error: chatErrorMessage(locale, CHAT_ERROR_CODE.unavailable),
          }),
      }),
    });
  } catch (error) {
    console.warn('[chat] Unable to start the Gemini stream.');
    if (error instanceof Error) {
      console.warn(error.name);
    }
    return chatError(503, locale, CHAT_ERROR_CODE.unavailable);
  }
}
