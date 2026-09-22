'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

function readAnchorOffset() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--header-offset')
    .trim();
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.height = raw || '7rem';
  document.body.appendChild(probe);
  const pixels = probe.getBoundingClientRect().height;
  probe.remove();
  return -Math.round(pixels);
}

export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const enable = () => {
      if (lenis || media.matches) {
        return;
      }

      lenis = new Lenis({
        autoRaf: true,
        anchors: { offset: readAnchorOffset() },
        duration: 1.05,
        smoothWheel: true,
        respectReducedMotion: true,
      });
    };

    const disable = () => {
      lenis?.destroy();
      lenis = null;
    };

    const sync = () => {
      if (media.matches) {
        disable();
        return;
      }

      enable();
    };

    sync();
    media.addEventListener('change', sync);

    return () => {
      media.removeEventListener('change', sync);
      disable();
    };
  }, []);

  return null;
}
