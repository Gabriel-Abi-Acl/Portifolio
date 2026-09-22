import type { Metadata } from 'next';
import type { LocaleCode, Person } from '@/content/types';
import { configuredSiteOrigin, siteOrigin } from './site-origin';

const OG_LOCALE: Record<LocaleCode, string> = {
  'pt-BR': 'pt_BR',
  en: 'en_US',
};

function templateLabel(siteName: string, fallback: string): string {
  const cleaned = siteName.replaceAll('%', '').trim();
  return cleaned || fallback;
}

export function documentTitle(
  person: Person,
  fallback: string,
): { title: string; siteName: string } {
  const name = person.displayName.trim();
  const role = person.shortTitle.trim();
  const siteName = name || fallback;
  const title = name && role ? `${name} — ${role}` : siteName;
  return { title, siteName };
}

/** Uses the locale bio when it exists. Otherwise the generic site description. */
export function documentDescription(
  bio: string | undefined,
  fallback: string,
): string {
  const text = bio?.replace(/\s+/g, ' ').trim() ?? '';
  if (!text) {
    return fallback;
  }
  if (text.length <= 160) {
    return text;
  }

  const sliced = text.slice(0, 157).trimEnd();
  const space = sliced.lastIndexOf(' ');
  const base = space > 80 ? sliced.slice(0, space) : sliced;
  return `${base}…`;
}

export function pageMetadata({
  locale,
  person,
  fallbackTitle,
  fallbackDescription,
}: {
  locale: LocaleCode;
  person: Person;
  fallbackTitle: string;
  fallbackDescription: string;
}): Metadata {
  const { title, siteName } = documentTitle(person, fallbackTitle);
  const description = documentDescription(
    person.bio?.[locale],
    fallbackDescription,
  );
  const path = locale === 'en' ? '/en' : '/';
  const name = person.displayName.trim();
  const indexable = configuredSiteOrigin() !== null;

  return {
    metadataBase: new URL(siteOrigin()),
    title: {
      default: title,
      template: `%s · ${templateLabel(siteName, fallbackTitle)}`,
    },
    description,
    applicationName: siteName,
    authors: name ? [{ name }] : undefined,
    alternates: {
      canonical: path,
      languages: {
        'pt-BR': '/',
        en: '/en',
        'x-default': '/',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: OG_LOCALE[locale],
      alternateLocale: [locale === 'en' ? 'pt_BR' : 'en_US'],
      siteName,
      url: path,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
