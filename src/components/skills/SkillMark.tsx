import { skillGlyph } from './icons';

type SkillMarkProps = {
  slug: string;
  name: string;
};

export function SkillMark({ slug, name }: SkillMarkProps) {
  const glyph = skillGlyph(slug);

  if (!glyph) {
    return (
      <span
        aria-hidden="true"
        className="grid h-6 w-6 place-items-center text-xs font-semibold text-accent"
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path d={glyph.path} fill={glyph.color} />
    </svg>
  );
}
