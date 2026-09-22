'use client';

import { MotionConfig, motion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { skillsArcPath, stageHeight } from './arc-path';
import { SkillMark } from './SkillMark';

const LOOP_SECONDS = 36;
const DEPTH_STEPS = 24;

export type SkillToken = {
  id: string;
  name: string;
  slug: string;
};

type SkillArcProps = {
  skills: SkillToken[];
  trackLabel: string;
};

type Stage = {
  width: number;
  height: number;
  d: string;
  near: number[];
};

const travel = {
  duration: LOOP_SECONDS,
  ease: 'linear' as const,
  repeat: Infinity,
  repeatType: 'loop' as const,
};

const chipClass =
  'grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-[rgb(12_10_24/0.9)] shadow-[0_10px_24px_rgb(0_0_0/0.35)] sm:h-12 sm:w-12';

function sampleNear(d: string): number[] {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  const length = path.getTotalLength();

  if (!Number.isFinite(length) || length <= 0) {
    return Array.from({ length: DEPTH_STEPS + 1 }, () => 0.5);
  }

  const ys: number[] = [];
  for (let index = 0; index <= DEPTH_STEPS; index += 1) {
    ys.push(path.getPointAtLength((index / DEPTH_STEPS) * length).y);
  }

  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = Math.max(1, max - min);
  return ys.map((y) => (y - min) / span);
}

function shift(values: number[], start: number): number[] {
  const steps = values.length - 1;
  const shifted: number[] = [];

  for (let index = 0; index <= steps; index += 1) {
    const progress = (start + index / steps) % 1;
    const cursor = progress * steps;
    const left = Math.floor(cursor) % steps;
    const right = (left + 1) % steps;
    const mix = cursor - Math.floor(cursor);
    shifted.push(values[left] * (1 - mix) + values[right] * mix);
  }

  return shifted;
}

function Rider({
  skill,
  start,
  path,
  near,
}: {
  skill: SkillToken;
  start: number;
  path: string;
  near: number[];
}) {
  const depth = shift(near, start);
  const scale = depth.map((value) => 0.68 + 0.32 * value);
  const opacity = depth.map((value) => 0.5 + 0.5 * value);
  const zIndex = depth.map((value) => Math.round(1 + value * 12));
  const from = `${(start * 100).toFixed(3)}%`;
  const to = `${((start + 1) * 100).toFixed(3)}%`;
  const offsetPath = `path("${path}")`;

  return (
    <motion.li
      title={skill.name}
      aria-label={skill.name}
      className="absolute top-0 left-0 m-0"
      initial={{
        offsetPath,
        offsetRotate: '0deg',
        offsetAnchor: 'center',
        offsetDistance: from,
        zIndex: zIndex[0],
      }}
      animate={{
        offsetPath,
        offsetRotate: '0deg',
        offsetAnchor: 'center',
        offsetDistance: [from, to],
        zIndex,
      }}
      transition={travel}
    >
      <motion.div
        aria-hidden="true"
        className={chipClass}
        initial={{ scale: scale[0], opacity: opacity[0] }}
        animate={{ scale, opacity }}
        transition={travel}
      >
        <SkillMark slug={skill.slug} name={skill.name} />
      </motion.div>
    </motion.li>
  );
}

export function SkillArc({ skills, trackLabel }: SkillArcProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage | null>(null);

  useLayoutEffect(() => {
    const node = stageRef.current;
    if (!node) {
      return;
    }

    const measure = () => {
      const width = node.clientWidth;
      if (width < 16) {
        return;
      }

      const height = stageHeight(width);
      const d = skillsArcPath(width, height);
      setStage((current) => {
        if (current && current.width === width && current.d === d) {
          return current;
        }

        return { width, height, d, near: sampleNear(d) };
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    // The track is display:none while reduced motion is on, so its width is 0
    // until that query flips. Measure again once it is shown.
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => {
      measure();
      requestAnimationFrame(measure);
    };
    media.addEventListener('change', onMotion);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', onMotion);
    };
  }, []);

  return (
    // CSS hides this track under reduced motion. Framer's own flag is sticky
    // for the session, so leaving it on would freeze the path after a reload.
    <MotionConfig reducedMotion="never">
      <div
        ref={stageRef}
        className="relative mt-8 w-full motion-reduce:hidden"
        style={{ height: stage?.height ?? 220 }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] top-1/2 h-16 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
        />
        {stage ? (
          <>
            <svg
              aria-hidden="true"
              className="absolute inset-0"
              width={stage.width}
              height={stage.height}
              viewBox={`0 0 ${stage.width} ${stage.height}`}
            >
              <path
                d={stage.d}
                fill="none"
                stroke="rgb(62 224 197 / 0.22)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d={stage.d}
                fill="none"
                stroke="rgb(245 243 251 / 0.42)"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
            <ul
              aria-label={trackLabel}
              className="absolute inset-0 m-0 list-none p-0"
            >
              {skills.map((skill, index) => (
                <Rider
                  key={skill.id}
                  skill={skill}
                  start={skills.length === 0 ? 0 : index / skills.length}
                  path={stage.d}
                  near={stage.near}
                />
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <ul
        aria-label={trackLabel}
        className="mt-8 hidden list-none flex-wrap justify-center gap-3 p-0 motion-reduce:flex"
      >
        {skills.map((skill) => (
          <li
            key={skill.id}
            className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 px-3 py-2"
          >
            <SkillMark slug={skill.slug} name={skill.name} />
            <span className="text-sm">{skill.name}</span>
          </li>
        ))}
      </ul>
    </MotionConfig>
  );
}
