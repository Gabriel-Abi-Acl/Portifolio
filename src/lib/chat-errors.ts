export const CHAT_LIMIT = {
  requests: 10,
  window: '10 m',
  windowMs: 10 * 60 * 1000,
} as const;

export const CHAT_ERROR_CODE = {
  missingKey: 'missing_key',
  rateLimited: 'rate_limited',
  invalid: 'invalid',
  unavailable: 'unavailable',
} as const;

export type ChatErrorCode =
  (typeof CHAT_ERROR_CODE)[keyof typeof CHAT_ERROR_CODE];

export type ChatLocale = 'pt-BR' | 'en';

const COPY: Record<ChatLocale, Record<ChatErrorCode, string>> = {
  en: {
    missing_key: 'Chat is off until GEMINI_API_KEY is set on the server.',
    rate_limited: 'Too many messages just now. Wait a moment and try again.',
    invalid: 'That message could not be sent. Try a shorter question.',
    unavailable: 'The assistant could not answer. Try again in a moment.',
  },
  'pt-BR': {
    missing_key:
      'O chat fica desligado até a GEMINI_API_KEY existir no servidor.',
    rate_limited: 'Muitas mensagens agora. Espere um pouco e tente de novo.',
    invalid:
      'Não foi possível enviar essa mensagem. Tente uma pergunta mais curta.',
    unavailable:
      'O assistente não conseguiu responder. Tente de novo em instantes.',
  },
};

export function chatErrorMessage(
  locale: ChatLocale,
  code: ChatErrorCode,
): string {
  return COPY[locale][code];
}

export function isChatErrorCode(value: unknown): value is ChatErrorCode {
  return (
    value === CHAT_ERROR_CODE.missingKey ||
    value === CHAT_ERROR_CODE.rateLimited ||
    value === CHAT_ERROR_CODE.invalid ||
    value === CHAT_ERROR_CODE.unavailable
  );
}
