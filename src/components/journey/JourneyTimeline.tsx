'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { journeyArcPath, journeyArcPoints } from './arc';
import { MilestoneIcon } from './icons';

export type JourneyTimelineItem = {
  id: string;
  dateLabel: string;
  title: string;
  description: string;
  icon?: string;
  placeholder: boolean;
};

type JourneyTimelineProps = {
  items: JourneyTimelineItem[];
  trackLabel: string;
  badge: string;
};

type MotionPreference = 'pending' | 'reduce' | 'ok';

const ARC_LIMIT = 4;

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

function Reveal({
  play,
  delay,
  className,
  children,
}: {
  play: boolean;
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  if (!play) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function ArcPath({ play, d }: { play: boolean; d: string }) {
  const props = {
    d,
    fill: 'none' as const,
    stroke: 'var(--accent)',
    strokeWidth: 2.5,
    strokeLinecap: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  };

  if (!play) {
    return <path {...props} />;
  }

  return (
    <motion.path
      {...props}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.15, ease: 'easeOut' }}
    />
  );
}

function MilestoneCard({
  item,
  badge,
}: {
  item: JourneyTimelineItem;
  badge: string;
}) {
  const titleId = `journey-${item.id}-title`;
  const description = item.description.trim();

  return (
    <article
      aria-labelledby={titleId}
      className="relative rounded-[1.15rem] border border-white/15 bg-[rgb(14_12_28/0.84)] px-3.5 pt-3 pb-7 shadow-[0_18px_36px_rgb(0_0_0/0.34),inset_0_1px_0_rgb(255_255_255/0.14)]"
    >
      {item.placeholder ? (
        <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-accent uppercase">
          {badge}
        </p>
      ) : null}
      <div className="mt-1.5 flex items-center gap-2">
        <p className="font-mono text-xs tracking-[0.14em] text-foreground">
          {item.dateLabel}
        </p>
        <span aria-hidden="true" className="h-3 w-px bg-white/20" />
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
        />
        <h3
          id={titleId}
          className="min-w-0 truncate text-sm font-medium text-accent"
        >
          {item.title}
        </h3>
      </div>
      <span aria-hidden="true" className="mt-2.5 block h-px bg-white/10" />
      {description ? (
        <p className="mt-2.5 line-clamp-4 text-sm leading-5 whitespace-pre-line text-muted">
          {description}
        </p>
      ) : null}
      <span
        aria-hidden="true"
        className="absolute -bottom-3.5 left-1/2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-accent/80 bg-[rgb(8_8_18)] text-accent shadow-[0_0_14px_rgb(62_224_197/0.45)]"
      >
        <MilestoneIcon name={item.icon} />
      </span>
    </article>
  );
}

function Node({
  icon,
  play,
  delay,
}: {
  icon?: string;
  play: boolean;
  delay: number;
}) {
  const glyph = (
    <span className="relative grid h-9 w-9 place-items-center">
      <span
        aria-hidden="true"
        className="absolute inset-[-7px] rounded-full bg-accent/25 blur-md"
      />
      <span className="relative grid h-9 w-9 place-items-center rounded-full border border-accent bg-[rgb(7_8_16)] text-accent shadow-[0_0_16px_rgb(62_224_197/0.8)]">
        <MilestoneIcon name={icon} />
      </span>
    </span>
  );

  if (!play) {
    return (
      <span
        aria-hidden="true"
        className="relative z-10 mt-1 inline-flex shrink-0 lg:mt-0"
      >
        {glyph}
      </span>
    );
  }

  return (
    <motion.span
      aria-hidden="true"
      className="relative z-10 mt-1 inline-flex shrink-0 lg:mt-0"
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {glyph}
    </motion.span>
  );
}

export function JourneyTimeline({
  items,
  trackLabel,
  badge,
}: JourneyTimelineProps) {
  const preference = useMotionPreference();
  const play = preference === 'ok';
  const useArc = items.length > 0 && items.length <= ARC_LIMIT;
  const points = journeyArcPoints(items.length);
  const path = journeyArcPath();

  return (
    <div className="relative mt-8">
      {useArc ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="journey-arc pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          <ArcPath play={play} d={path} />
        </svg>
      ) : null}

      <ol
        aria-label={trackLabel}
        className={
          useArc
            ? 'relative m-0 list-none p-0 lg:h-[30rem]'
            : 'relative m-0 list-none p-0'
        }
      >
        {useArc ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[18%] bottom-[12%] hidden h-24 rounded-full bg-accent/10 blur-3xl lg:block"
          />
        ) : null}
        {items.map((item, index) => {
          const point = points[index];
          const delay =
            items.length <= 1
              ? 0.12
              : 0.12 + (index / (items.length - 1)) * 0.7;
          const arcStyle = useArc
            ? ({
                '--jx': `${point.x}%`,
                '--jy': `${point.y}%`,
              } as CSSProperties)
            : undefined;

          return (
            <li
              key={item.id}
              className={
                useArc
                  ? 'relative flex items-start gap-4 pb-10 last:pb-2 lg:absolute lg:block lg:h-0 lg:w-44 lg:-translate-x-1/2 lg:pb-0 lg:left-[var(--jx)] lg:top-[var(--jy)]'
                  : 'relative flex items-start gap-4 pb-10 last:pb-2'
              }
              style={arcStyle}
            >
              {index < items.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={
                    useArc
                      ? 'absolute top-8 bottom-0 left-[1.15rem] w-px bg-accent/55 shadow-[0_0_8px_rgb(62_224_197/0.65)] lg:hidden'
                      : 'absolute top-8 bottom-0 left-[1.15rem] w-px bg-accent/55 shadow-[0_0_8px_rgb(62_224_197/0.65)]'
                  }
                />
              ) : null}
              <span
                className={
                  useArc
                    ? 'shrink-0 lg:absolute lg:top-0 lg:left-1/2 lg:z-20 lg:-translate-x-1/2 lg:-translate-y-1/2'
                    : 'shrink-0'
                }
              >
                <Node icon={item.icon} play={play} delay={delay} />
              </span>
              {useArc ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-6 left-1/2 hidden h-6 w-px -translate-x-1/2 bg-accent/80 shadow-[0_0_8px_rgb(62_224_197/0.8)] lg:block"
                />
              ) : null}
              <Reveal
                play={play}
                delay={delay}
                className={
                  useArc
                    ? 'min-w-0 flex-1 lg:absolute lg:bottom-14 lg:left-1/2 lg:w-44 lg:-translate-x-1/2'
                    : 'min-w-0 flex-1'
                }
              >
                <MilestoneCard item={item} badge={badge} />
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
