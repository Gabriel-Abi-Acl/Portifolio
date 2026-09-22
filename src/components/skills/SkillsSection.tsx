import { getTranslations } from 'next-intl/server';
import type { Skill } from '@/content/types';
import { HOME_SECTIONS } from '@/lib/sections';
import { GlassCard } from '@/components/shell/GlassCard';
import { SkillArc } from './SkillArc';

type SkillsSectionProps = {
  skills: Skill[];
};

export async function SkillsSection({ skills }: SkillsSectionProps) {
  const t = await getTranslations('skills');
  const index = HOME_SECTIONS.findIndex((section) => section.id === 'skills');
  const label = String(index + 1).padStart(2, '0');
  const showPlaceholderNote = skills.some((skill) => skill.placeholder);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
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
          id="skills-title"
          className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {t('title')}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          {t('blurb')}
        </p>

        {skills.length === 0 ? (
          <p className="mt-4 text-sm leading-6 text-muted">{t('empty')}</p>
        ) : (
          <>
            {showPlaceholderNote ? (
              <p className="mt-3 text-sm font-medium text-accent">
                {t('placeholderNote')}
              </p>
            ) : null}
            <SkillArc
              trackLabel={t('trackLabel')}
              skills={skills.map((skill) => ({
                id: skill.id,
                name: skill.name,
                slug: skill.icon.slug,
              }))}
            />
          </>
        )}
      </GlassCard>
    </section>
  );
}
