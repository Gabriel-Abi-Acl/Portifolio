import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing, type AppLocale } from './routing';

const messageLoaders: Record<
  AppLocale,
  () => Promise<{ default: Record<string, unknown> }>
> = {
  'pt-BR': () => import('../../messages/pt-BR.json'),
  en: () => import('../../messages/en.json'),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await messageLoaders[locale]()).default,
  };
});
