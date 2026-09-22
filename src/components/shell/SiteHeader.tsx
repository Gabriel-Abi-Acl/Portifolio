'use client';

import { useEffect, useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { HOME_SECTIONS, type HomeSectionId } from '@/lib/sections';
import { GlassCard } from './GlassCard';

type SiteHeaderProps = {
  brand?: string;
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M3 5h12M3 9h12M3 13h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M4.5 4.5l9 9M13.5 4.5l-9 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader({ brand }: SiteHeaderProps) {
  const t = useTranslations('shell');
  const sections = useTranslations('sections');
  const locale = useLocale();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<HomeSectionId>('hero');
  const label = brand?.trim() ? brand.trim() : t('brand');

  useEffect(() => {
    const nodes = HOME_SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter((node): node is HTMLElement => node !== null);

    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) {
          return;
        }

        const id = visible.target.id;
        if (HOME_SECTIONS.some((section) => section.id === id)) {
          setActive(id as HomeSectionId);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.15, 0.4, 0.7],
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (desktop.matches) {
        setOpen(false);
      }
    };

    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
      >
        {t('skip')}
      </a>
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative flex items-center justify-between gap-3">
          <GlassCard shape="pill" className="min-w-0 px-4 py-2.5">
            <a
              href="#hero"
              className="flex min-w-0 items-center gap-2 text-sm font-semibold tracking-tight"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-accent"
              />
              <span className="truncate">{label}</span>
            </a>
          </GlassCard>

          <GlassCard
            shape="pill"
            className="absolute left-1/2 hidden -translate-x-1/2 px-2 py-1.5 lg:block"
          >
            <nav aria-label={t('navLabel')}>
              <ul className="flex items-center gap-0.5">
                {HOME_SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={active === section.id ? 'true' : undefined}
                      className={cx(
                        'block rounded-full px-3 py-1.5 text-sm whitespace-nowrap',
                        active === section.id
                          ? 'bg-white/15 text-foreground'
                          : 'text-muted hover:bg-white/10 hover:text-foreground',
                      )}
                    >
                      {sections(section.id)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </GlassCard>

          <GlassCard
            shape="pill"
            className="flex items-center gap-1 px-1.5 py-1.5"
          >
            <nav aria-label={t('localeLabel')} className="flex items-center">
              <LocaleLink code="pt-BR" current={locale === 'pt-BR'}>
                pt-BR
              </LocaleLink>
              <LocaleLink code="en" current={locale === 'en'}>
                EN
              </LocaleLink>
            </nav>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-white/10 lg:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">
                {open ? t('menuClose') : t('menuOpen')}
              </span>
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </GlassCard>
        </div>

        {open ? (
          <GlassCard id={menuId} className="mt-3 p-2 lg:hidden">
            <nav aria-label={t('navLabel')}>
              <ul className="flex flex-col">
                {HOME_SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={active === section.id ? 'true' : undefined}
                      onClick={() => setOpen(false)}
                      className={cx(
                        'block rounded-2xl px-3 py-2.5 text-sm',
                        active === section.id
                          ? 'bg-white/15 text-foreground'
                          : 'text-muted hover:bg-white/10 hover:text-foreground',
                      )}
                    >
                      {sections(section.id)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </GlassCard>
        ) : null}
      </div>
    </header>
  );
}

function LocaleLink({
  code,
  current,
  children,
}: {
  code: 'pt-BR' | 'en';
  current: boolean;
  children: string;
}) {
  return (
    <Link
      href="/"
      locale={code}
      hrefLang={code}
      aria-current={current ? 'true' : undefined}
      className={cx(
        'rounded-full px-2.5 py-1 text-xs font-medium',
        current
          ? 'bg-white/15 text-foreground'
          : 'text-muted hover:text-foreground',
      )}
    >
      {children}
    </Link>
  );
}
