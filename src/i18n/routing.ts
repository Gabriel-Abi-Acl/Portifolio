import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['pt-BR', 'en'],
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed',
  // Keep `/` in pt-BR. English is an explicit `/en` choice, not Accept-Language.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
