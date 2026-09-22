import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/shell/SiteHeader';
import { SmoothScroll } from '@/components/shell/SmoothScroll';
import { StarfieldBackground } from '@/components/shell/StarfieldBackground';
import { loadPerson } from '@/content/load';
import { routing } from '@/i18n/routing';
import 'lenis/dist/lenis.css';
import '../globals.css';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const person = loadPerson();

  return (
    <html lang={locale} className="bg-background">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <style>{`@media (prefers-reduced-motion: reduce) {
  .glass-card {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: var(--card-solid) !important;
  }
}`}</style>
        <NextIntlClientProvider>
          <SmoothScroll />
          <StarfieldBackground />
          <SiteHeader brand={person.displayName} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
