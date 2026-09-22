import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { GlassCard } from '@/components/shell/GlassCard';
import type { Person } from '@/content/types';
import { initialsFromName, localAvatarSrc } from '@/lib/avatar';
import { isGeminiConfigured } from '@/lib/server-env';
import { HOME_SECTIONS } from '@/lib/sections';

type HeroSectionProps = {
  person: Person;
};

function AvatarSlot({
  src,
  alt,
  initials,
  emptyLabel,
}: {
  src: string | null;
  alt: string;
  initials: string;
  emptyLabel: string;
}) {
  if (src) {
    return (
      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/15">
        <Image src={src} alt={alt} fill sizes="96px" className="object-cover" />
      </div>
    );
  }

  if (initials) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="grid h-24 w-24 place-items-center rounded-full border border-white/15 bg-white/5 text-xl font-semibold tracking-wide text-accent"
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={emptyLabel}
      className="h-24 w-24 rounded-full border border-dashed border-white/25 bg-white/5"
    />
  );
}

export async function HeroSection({ person }: HeroSectionProps) {
  const t = await getTranslations('hero');
  const name = person.displayName.trim();
  const avatarSrc = localAvatarSrc(person.avatar.src);
  const initials = name ? initialsFromName(name) : '';
  const avatarAlt = person.avatar.alt.trim() || name || t('avatarEmpty');
  const index = HOME_SECTIONS.findIndex((section) => section.id === 'hero');
  const label = String(index + 1).padStart(2, '0');

  return (
    <section id="hero" aria-labelledby="hero-title" className="lg:col-span-2">
      <div className="relative isolate h-full">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-accent/10 blur-3xl"
        />
        <GlassCard className="h-full px-6 py-10 sm:px-10 sm:py-14">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="font-mono text-xs tracking-[0.18em] text-accent"
            >
              {label}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
            <p className="text-[0.7rem] font-medium tracking-[0.18em] text-muted uppercase">
              {t('kicker')}
            </p>
          </div>

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div>
              <AvatarSlot
                src={avatarSrc}
                alt={avatarAlt}
                initials={initials}
                emptyLabel={t('avatarEmpty')}
              />
              {name ? (
                <p className="mt-5 text-lg font-medium tracking-tight">
                  {name}
                </p>
              ) : (
                <p className="mt-5 text-lg font-medium tracking-tight text-muted">
                  <span className="sr-only">{t('nameMissing')} </span>
                  {t('namePlaceholder')}
                </p>
              )}
              <h1
                id="hero-title"
                className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
              >
                {t('headline')}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                {t('subhead')}
              </p>
            </div>
            <ChatPanel configured={isGeminiConfigured()} />
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
