import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AboutSection } from '@/components/about/AboutSection';
import { ContactSection } from '@/components/contact/ContactSection';
import { HeroSection } from '@/components/hero/HeroSection';
import { JourneySection } from '@/components/journey/JourneySection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { SkillsSection } from '@/components/skills/SkillsSection';
import {
  loadJourney,
  loadKnowledgeChunks,
  loadPerson,
  loadProjects,
  loadSkills,
} from '@/content/load';
import { routing } from '@/i18n/routing';

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
  const person = loadPerson();
  const skills = loadSkills();
  const projects = loadProjects();
  const journey = loadJourney();
  const chunks = loadKnowledgeChunks();

  return (
    <main
      id="content"
      tabIndex={-1}
      className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:grid-cols-2 lg:gap-6"
    >
      <HeroSection person={person} />
      <AboutSection person={person} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <JourneySection milestones={journey} />
      <ContactSection person={person} />

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
