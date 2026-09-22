import type { ReactNode } from 'react';

type GlassCardProps = {
  shape?: 'panel' | 'pill';
  tone?: 'default' | 'strong';
  className?: string;
  children: ReactNode;
  id?: string;
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function GlassCard({
  shape = 'panel',
  tone = 'default',
  className,
  children,
  id,
}: GlassCardProps) {
  return (
    <div
      id={id}
      className={cx(
        'glass-card',
        shape === 'pill' && 'glass-card-pill',
        tone === 'strong' && 'glass-card-strong',
        className,
      )}
      style={{
        backdropFilter: 'blur(var(--blur-glass))',
        WebkitBackdropFilter: 'blur(var(--blur-glass))',
      }}
    >
      {children}
    </div>
  );
}
