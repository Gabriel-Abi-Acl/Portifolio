import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
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
      {HOME_SECTIONS.map((section, index) => (
        <SectionPlaceholder
          key={section.id}
          id={section.id}
          index={index + 1}
          title={sections(section.id)}
          note={t('coming', { pr: section.pr })}
          className={
            section.id === 'hero' || section.id === 'contact'
              ? 'lg:col-span-2'
              : undefined
          }
          kicker={section.id === 'hero' ? t('kicker') : undefined}
          headline={section.id === 'hero' ? t('title') : undefined}
          intro={section.id === 'hero' ? t('intro') : undefined}
        />
      ))}

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
