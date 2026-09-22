import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-6 py-10">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <p className="mt-2 text-sm">{t('body')}</p>
    </main>
  );
}
