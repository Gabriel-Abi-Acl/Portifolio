import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { GlassCard } from '@/components/shell/GlassCard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('notFound');
  return { title: t('title') };
}

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <main
      id="content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-5xl flex-col px-4 pt-32 pb-16 sm:px-6"
    >
      <GlassCard className="px-6 py-10 sm:px-10">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          {t('body')}
        </p>
      </GlassCard>
    </main>
  );
}
