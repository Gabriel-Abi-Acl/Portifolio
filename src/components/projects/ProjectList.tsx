'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type ReactNode } from 'react';
import type { ProjectCardModel, ProjectLinkLabel } from './model';

type ProjectListProps = {
  items: ProjectCardModel[];
};

type MotionPreference = 'pending' | 'reduce' | 'ok';

function useMotionPreference(): MotionPreference {
  const [preference, setPreference] = useState<MotionPreference>('pending');

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPreference(media.matches ? 'reduce' : 'ok');
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return preference;
}

function linkText(
  t: ReturnType<typeof useTranslations<'projects'>>,
  label: ProjectLinkLabel,
): string {
  switch (label) {
    case 'live':
      return t('links.live');
    case 'repo':
      return t('links.repo');
    case 'case':
      return t('links.case');
    case 'other':
      return t('links.other');
  }
}

function Screenshot({
  src,
  alt,
  missingLabel,
}: {
  src: string | null;
  alt: string;
  missingLabel: string;
}) {
  return (
    <div className="rounded-[1.25rem] bg-gradient-to-br from-accent/40 via-white/15 to-[rgb(155_125_255/0.45)] p-px">
      {src ? (
        <div className="overflow-hidden rounded-[1.15rem] bg-[#100c1c]">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={750}
            unoptimized={src.endsWith('.svg')}
            sizes="(min-width: 768px) 32rem, 100vw"
            className="h-auto w-full"
          />
        </div>
      ) : (
        <div className="grid aspect-[16/10] place-items-center rounded-[1.15rem] border border-dashed border-white/20 bg-[linear-gradient(145deg,#1c1634_0%,#0c1c24_100%)] px-6 text-center">
          <p className="text-[0.7rem] font-medium tracking-[0.16em] text-muted uppercase">
            {missingLabel}
          </p>
        </div>
      )}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M3 11L11 3M11 3H5.5M11 3V8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectCard({
  item,
  index,
  badge,
  missingLabel,
  tagsLabel,
  linksLabel,
  newTab,
  linkLabel,
}: {
  item: ProjectCardModel;
  index: number;
  badge: string;
  missingLabel: string;
  tagsLabel: string;
  linksLabel: string;
  newTab: string;
  linkLabel: (label: ProjectLinkLabel) => string;
}) {
  const titleId = `project-${item.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="grid items-center gap-4 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_18px_40px_rgb(0_0_0/0.22)] sm:p-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] md:gap-6 md:p-5"
    >
      <Screenshot
        src={item.screenshotSrc}
        alt={item.screenshotAlt}
        missingLabel={missingLabel}
      />

      <div className="flex min-w-0 flex-col justify-center px-1 py-1 md:px-2 md:py-2">
        <p className="font-mono text-xs tracking-[0.18em] text-accent">
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          {item.placeholder ? (
            <span className="ml-3 tracking-[0.16em] uppercase">{badge}</span>
          ) : null}
        </p>
        <h3
          id={titleId}
          className="mt-2 text-xl font-semibold tracking-tight text-balance sm:text-2xl"
        >
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-pretty text-muted">
          {item.summary}
        </p>

        {item.techTags.length > 0 ? (
          <ul
            aria-label={tagsLabel}
            className="mt-4 flex list-none flex-wrap gap-2 p-0"
          >
            {item.techTags.map((tag, tagIndex) => (
              <li key={`${tag}-${tagIndex}`}>
                <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-wide text-foreground">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {item.links.length > 0 ? (
          <ul
            aria-label={linksLabel}
            className="mt-4 flex list-none flex-wrap gap-x-4 gap-y-2 p-0"
          >
            {item.links.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <a
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
                  {...(link.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {linkLabel(link.label)}
                  {link.external ? (
                    <>
                      <ArrowIcon />
                      <span className="sr-only">({newTab})</span>
                    </>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

function Row({
  play,
  index,
  children,
}: {
  play: boolean;
  index: number;
  children: ReactNode;
}) {
  if (!play) {
    return <li>{children}</li>;
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index, 8) * 0.08,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.li>
  );
}

export function ProjectList({ items }: ProjectListProps) {
  const t = useTranslations('projects');
  const preference = useMotionPreference();
  const play = preference === 'ok';

  return (
    <ul className="mt-8 flex list-none flex-col gap-5 p-0">
      {items.map((item, index) => (
        <Row key={item.id} play={play} index={index}>
          <ProjectCard
            item={item}
            index={index}
            badge={t('placeholderBadge')}
            missingLabel={t('screenshotMissing')}
            tagsLabel={t('tagsLabel')}
            linksLabel={t('linksLabel')}
            newTab={t('newTab')}
            linkLabel={(label) => linkText(t, label)}
          />
        </Row>
      ))}
    </ul>
  );
}
