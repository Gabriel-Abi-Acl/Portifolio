'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

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
        anchors: true,
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
