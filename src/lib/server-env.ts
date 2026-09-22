import 'server-only';

export function readServerEnv(name: string): string {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function isGeminiConfigured(): boolean {
  return readServerEnv('GEMINI_API_KEY').length > 0;
}
