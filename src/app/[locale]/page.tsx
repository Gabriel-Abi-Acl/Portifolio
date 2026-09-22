import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { HeroSection } from '@/components/hero/HeroSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { SkillsSection } from '@/components/skills/SkillsSection';
import { SectionPlaceholder } from '@/components/shell/SectionPlaceholder';
import {
  loadJourney,
  loadKnowledgeChunks,
  loadPerson,
  loadProjects,
  loadSkills,
} from '@/content/load';
import { routing } from '@/i18n/routing';
import { HOME_SECTIONS } from '@/lib/sections';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

// The hero reads GEMINI_API_KEY on each request. A static page would freeze
// the chat as off even after the key is added.
export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations('shell');
  const sections = await getTranslations('sections');
  const person = loadPerson();
  const skills = loadSkills();
  const projects = loadProjects();
  const journey = loadJourney();
  const chunks = loadKnowledgeChunks();

  return (
    <main
      id="content"
      className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-4 pt-28 pb-24 sm:px-6 sm:pt-32 lg:grid-cols-2 lg:gap-6"
    >
      {HOME_SECTIONS.map((section, index) => {
        if (section.id === 'hero') {
          return <HeroSection key={section.id} person={person} />;
        }

        if (section.id === 'skills') {
          return <SkillsSection key={section.id} skills={skills} />;
        }

        if (section.id === 'projects') {
          return <ProjectsSection key={section.id} projects={projects} />;
        }

        return (
          <SectionPlaceholder
            key={section.id}
            id={section.id}
            index={index + 1}
            title={sections(section.id)}
            note={t('coming', { pr: section.pr })}
            className={section.id === 'contact' ? 'lg:col-span-2' : undefined}
          />
        );
      })}

      <p className="px-2 text-center text-xs leading-5 text-muted lg:col-span-2">
        {t('contentStatus', {
          socials: person.socials.length,
          skills: skills.length,
          projects: projects.length,
          journey: journey.length,
          chunks: chunks.length,
        })}
      </p>
    </main>
  );
}
