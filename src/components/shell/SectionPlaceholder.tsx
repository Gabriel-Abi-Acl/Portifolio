import { GlassCard } from './GlassCard';

type SectionPlaceholderProps = {
  id: string;
  title: string;
  note: string;
  index: number;
  className?: string;
  kicker?: string;
  headline?: string;
  intro?: string;
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function SectionPlaceholder({
  id,
  title,
  note,
  index,
  className,
  kicker,
  headline,
  intro,
}: SectionPlaceholderProps) {
  const isHero = Boolean(headline);
  const label = String(index).padStart(2, '0');

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cx('section-anchor', className)}
    >
      <div className={cx('relative h-full', isHero && 'isolate')}>
        {isHero ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-accent/10 blur-3xl"
          />
        ) : null}
        <GlassCard
          className={cx(
            'h-full',
            isHero
              ? 'px-6 py-10 sm:px-10 sm:py-14'
              : 'px-6 py-8 sm:px-8 sm:py-9',
          )}
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="font-mono text-xs tracking-[0.18em] text-accent"
            >
              {label}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
            {kicker ? (
              <p className="text-[0.7rem] font-medium tracking-[0.18em] text-muted uppercase">
                {kicker}
              </p>
            ) : null}
          </div>

          {isHero ? (
            <>
              <h1
                id={`${id}-title`}
                className="mt-8 max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
              >
                {headline}
              </h1>
              {intro ? (
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                  {intro}
                </p>
              ) : null}
            </>
          ) : (
            <h2
              id={`${id}-title`}
              className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {title}
            </h2>
          )}

          <p
            className={cx(
              'max-w-xl text-sm leading-6 text-muted',
              isHero ? 'mt-8' : 'mt-3',
            )}
          >
            {note}
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
