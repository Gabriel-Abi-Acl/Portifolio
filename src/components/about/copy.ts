import type { LocaleCode, LocalizedCopy } from '@/content/types';

export function copyForLocale(
  copy: LocalizedCopy | undefined,
  locale: string,
): string {
  if (!copy) return '';
  if (locale !== 'pt-BR' && locale !== 'en') return '';
  return copy[locale as LocaleCode]?.trim() ?? '';
}
