import { getTranslations } from 'next-intl/server';
import { GlassCard } from '@/components/shell/GlassCard';
import type { Project } from '@/content/types';
import { localPublicSrc } from '@/lib/public-asset';
import { HOME_SECTIONS } from '@/lib/sections';
import { presentHref } from '@/lib/links';
import type { ProjectCardModel } from './model';
import { ProjectList } from './ProjectList';

type ProjectsSectionProps = {
  projects: Project[];
};

function toCard(project: Project): ProjectCardModel {
  const links = (project.links ?? []).flatMap((link) => {
    const safe = presentHref(link.href);
    if (!safe) return [];
    return [{ label: link.label, href: safe.href, external: safe.external }];
  });

  return {
    id: project.id,
    title: project.title,
    summary: project.summary,
    screenshotSrc: localPublicSrc(project.screenshot.src),
    screenshotAlt: project.screenshot.alt.trim() || project.title,
    techTags: project.techTags.map((tag) => tag.trim()).filter(Boolean),
    placeholder: project.placeholder === true,
    links,
  };
}

export async function ProjectsSection({ projects }: ProjectsSectionProps) {
  const t = await getTranslations('projects');
  const index = HOME_SECTIONS.findIndex((section) => section.id === 'projects');
  const label = String(index + 1).padStart(2, '0');
  const cards = projects.map(toCard);
  const showPlaceholderNote = cards.some((card) => card.placeholder);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
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
          id="projects-title"
          className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {t('title')}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          {t('intro')}
        </p>

        {cards.length === 0 ? (
          <p className="mt-4 text-sm leading-6 text-muted">{t('empty')}</p>
        ) : (
          <>
            {showPlaceholderNote ? (
              <p className="mt-5 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm leading-6 text-foreground">
                {t('placeholderNote')}
              </p>
            ) : null}
            <ProjectList items={cards} />
          </>
        )}
      </GlassCard>
    </section>
  );
}
