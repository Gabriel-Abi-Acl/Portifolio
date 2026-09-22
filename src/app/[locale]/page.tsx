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
import { Link } from '@/i18n/navigation';
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
    <main className="mx-auto flex w-full max-w-3xl flex-col px-6 py-10">
      <header className="mb-8">
        <p className="text-sm">{t('kicker')}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6">{t('intro')}</p>
        <nav aria-label={t('navLabel')} className="mt-6">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {HOME_SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  className="underline underline-offset-4"
                  href={`#${section.id}`}
                >
                  {sections(section.id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-4 text-sm">
          <Link
            href="/"
            locale="pt-BR"
            className="underline underline-offset-4"
          >
            pt-BR
          </Link>
          {' · '}
          <Link href="/" locale="en" className="underline underline-offset-4">
            en
          </Link>
        </p>
      </header>

      {HOME_SECTIONS.map((section) => (
        <SectionPlaceholder
          key={section.id}
          id={section.id}
          title={sections(section.id)}
          note={t('coming', { pr: section.pr })}
        />
      ))}

      <p className="mt-10 text-xs leading-5">
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
