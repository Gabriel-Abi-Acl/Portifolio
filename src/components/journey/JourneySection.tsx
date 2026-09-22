import { getTranslations } from 'next-intl/server';
import { GlassCard } from '@/components/shell/GlassCard';
import type { JourneyMilestone } from '@/content/types';
import { HOME_SECTIONS } from '@/lib/sections';
import { JourneyTimeline, type JourneyTimelineItem } from './JourneyTimeline';

type JourneySectionProps = {
  milestones: JourneyMilestone[];
};

const KIND_ICON: Record<JourneyMilestone['kind'], string> = {
  education: 'sprout',
  work: 'pencil',
  project: 'cube',
  award: 'star',
  other: 'dot',
};

function toItem(milestone: JourneyMilestone): JourneyTimelineItem {
  return {
    id: milestone.id,
    dateLabel: milestone.dateLabel,
    title: milestone.title,
    description: milestone.description,
    icon: milestone.icon || KIND_ICON[milestone.kind],
    placeholder: milestone.placeholder === true,
  };
}

export async function JourneySection({ milestones }: JourneySectionProps) {
  const t = await getTranslations('journey');
  const index = HOME_SECTIONS.findIndex((section) => section.id === 'journey');
  const label = String(index + 1).padStart(2, '0');
  const items = milestones.map(toItem);
  const showPlaceholderNote = items.some((item) => item.placeholder);

  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="lg:col-span-2"
    >
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
          id="journey-title"
          className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {t('title')}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          {t('intro')}
        </p>

        {items.length === 0 ? (
          <p className="mt-4 text-sm leading-6 text-muted">{t('empty')}</p>
        ) : (
          <>
            {showPlaceholderNote ? (
              <p className="mt-5 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm leading-6 text-foreground">
                {t('placeholderNote')}
              </p>
            ) : null}
            <JourneyTimeline
              items={items}
              trackLabel={t('trackLabel')}
              badge={t('placeholderBadge')}
            />
            <div className="mt-4 flex flex-col items-center px-2 text-center sm:mt-2">
              <span aria-hidden="true" className="mb-4 h-px w-16 bg-white/20" />
              <p className="max-w-md text-sm leading-6 text-muted">
                {t('footer')}
              </p>
              <p className="mt-2 text-sm tracking-wide text-foreground">
                {t('motto')}
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
                />
              </p>
            </div>
          </>
        )}
      </GlassCard>
    </section>
  );
}
