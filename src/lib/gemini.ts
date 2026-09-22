import 'server-only';

import { createGoogle } from '@ai-sdk/google';
import { readServerEnv } from './server-env';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';

const MODEL_ID = /^[\w.-]+$/;

export function geminiModelId(): string {
  const configured = readServerEnv('GEMINI_MODEL');
  if (configured && MODEL_ID.test(configured)) {
    return configured;
  }

  return DEFAULT_GEMINI_MODEL;
}

export function geminiLanguageModel() {
  const apiKey = readServerEnv('GEMINI_API_KEY');
  if (!apiKey) {
    return null;
  }

  const google = createGoogle({ apiKey });
  return google(geminiModelId());
}
