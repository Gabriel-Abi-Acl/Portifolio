import { getTranslations } from 'next-intl/server';

type SiteFooterProps = {
  name: string;
  locale: string;
};

export async function SiteFooter({ name, locale }: SiteFooterProps) {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();
  const label = name.trim();

  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6">
      <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-sm text-foreground">
          <span className="font-mono text-xs tracking-[0.14em] text-accent">
            {year}
          </span>
          <span aria-hidden="true" className="mx-2 text-muted">
            ·
          </span>
          {label ? (
            <span>{label}</span>
          ) : (
            <span className="text-muted">{t('namePlaceholder')}</span>
          )}
        </p>
        <p className="mt-2 text-xs leading-5 text-muted">
          {t('localeNote', { locale })}
        </p>
      </div>
    </footer>
  );
}
