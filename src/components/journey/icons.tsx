import type { ReactNode } from 'react';

type IconProps = {
  className?: string;
};

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function SproutIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 21V11" />
      <path d="M12 14c-2.6-.5-4.6-2.8-4.8-5.6 2.5.2 4.4 1.6 4.8 5.6z" />
      <path d="M12 12.5c2.2-.7 4.6-2.4 5.6-5.2-2.4.3-4.6 1.8-5.6 5.2z" />
    </Svg>
  );
}

function PencilIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M13.2 6.2l4.6 4.6" />
      <path d="M4.2 19.8l1.1-4.4L15.4 5.3a1.7 1.7 0 012.4 0l1 1a1.7 1.7 0 010 2.4L8.6 18.8l-4.4 1z" />
    </Svg>
  );
}

function CubeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3.2l7.5 4.2v9.1L12 20.8l-7.5-4.3V7.4L12 3.2z" />
      <path d="M12 12.2l7.5-4.2" />
      <path d="M12 12.2v8.6" />
      <path d="M12 12.2L4.5 8" />
    </Svg>
  );
}

function StarIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3.4l2.15 4.55 5 .7-3.65 3.45.9 4.95L12 14.9l-4.4 2.15.9-4.95L4.85 8.65l5-.7L12 3.4z" />
    </Svg>
  );
}

function DotIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
    </Svg>
  );
}

const ICONS: Record<string, (props: IconProps) => ReactNode> = {
  sprout: SproutIcon,
  pencil: PencilIcon,
  cube: CubeIcon,
  star: StarIcon,
  dot: DotIcon,
};

export function MilestoneIcon({
  name,
  className = 'h-4 w-4',
}: {
  name?: string;
  className?: string;
}) {
  const Icon = (name && ICONS[name]) || DotIcon;
  return <Icon className={className} />;
}
