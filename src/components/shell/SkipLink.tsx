'use client';

type SkipLinkProps = {
  label: string;
};

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#content"
      className="skip-link"
      onClick={() => {
        window.requestAnimationFrame(() => {
          document.getElementById('content')?.focus({ preventScroll: true });
        });
      }}
    >
      {label}
    </a>
  );
}
