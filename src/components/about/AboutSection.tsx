import { getLocale, getTranslations } from 'next-intl/server';
import { GlassCard } from '@/components/shell/GlassCard';
import type { Person } from '@/content/types';
import { HOME_SECTIONS } from '@/lib/sections';
import { copyForLocale } from './copy';
import { GalaxyModal } from './GalaxyModal';

type AboutSectionProps = {
  person: Person;
};

const CHIP_OFFSETS = ['mt-3', 'mt-10 sm:ml-16', 'mt-2 sm:ml-8', 'mt-8 sm:ml-4'];

export async function AboutSection({ person }: AboutSectionProps) {
  const t = await getTranslations('about');
  const locale = await getLocale();
  const index = HOME_SECTIONS.findIndex((section) => section.id === 'about');
  const label = String(index + 1).padStart(2, '0');
  const bio = copyForLocale(person.bio, locale);
  const role = person.shortTitle.trim();
  const place = person.location?.label.trim() ?? '';
  const interests = (person.interests ?? []).flatMap((interest) => {
    const text = copyForLocale(interest.label, locale);
    return text ? [{ id: interest.id, label: text }] : [];
  });
  const usingPlaceholders = interests.length === 0;
  const chips = usingPlaceholders
    ? [1, 2, 3].map((n) => ({
        id: `placeholder-${n}`,
        label: t('interestPlaceholder', { n }),
      }))
    : interests;

  return (
    <section id="about" aria-labelledby="about-title" className="lg:col-span-2">
      <GlassCard className="h-full px-6 py-8 sm:px-8 sm:py-10">
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

        <h2
          id="about-title"
          className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {t('title')}
        </h2>
        {role ? (
          <p className="mt-2 text-sm font-medium text-accent">{role}</p>
        ) : null}
        {place ? <p className="mt-1 text-sm text-muted">{place}</p> : null}
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          {t('blurb')}
        </p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            {bio ? (
              <p className="max-w-xl text-base leading-7 text-foreground">
                {bio}
              </p>
            ) : (
              <p className="max-w-xl rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm leading-6 text-foreground">
                {t('bioPlaceholder')}
              </p>
            )}
            <div className="mt-6">
              <GalaxyModal />
            </div>
          </div>

          <div className="relative min-h-64 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-5 py-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(62_224_197/0.14),transparent_68%)]"
            />
            <div
              aria-hidden="true"
              className="about-orbit h-40 w-40 rounded-full border border-dashed border-white/15"
            />
            <div
              aria-hidden="true"
              className="about-orbit h-24 w-24 rounded-full border border-white/10"
              style={{
                animationDuration: '32s',
                animationDirection: 'reverse',
              }}
            />
            <p className="relative text-[0.7rem] font-medium tracking-[0.18em] text-muted uppercase">
              {usingPlaceholders
                ? t('interestsPlaceholderLabel')
                : t('interestsLabel')}
            </p>
            <ul className="relative mt-4 flex flex-col">
              {chips.map((chip, chipIndex) => (
                <li
                  key={chip.id}
                  className={`about-float w-fit ${CHIP_OFFSETS[chipIndex % CHIP_OFFSETS.length]}`}
                  style={{ animationDelay: `${chipIndex * 0.7}s` }}
                >
                  <span className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-[rgb(12_10_24/0.78)] px-3.5 py-2 text-sm shadow-[0_12px_28px_rgb(0_0_0/0.28)]">
                    {usingPlaceholders ? (
                      <span className="text-[0.65rem] font-medium tracking-[0.14em] text-accent uppercase">
                        {t('placeholderBadge')}
                      </span>
                    ) : null}
                    {chip.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
