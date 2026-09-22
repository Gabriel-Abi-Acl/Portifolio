'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { subscribeScrollLock } from '@/lib/scroll-lock';

export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let locked = false;

    const unsubscribe = subscribeScrollLock((next) => {
      locked = next;
      if (!lenis) return;
      if (next) lenis.stop();
      else lenis.start();
    });

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
      if (locked) lenis.stop();
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
      unsubscribe();
      disable();
    };
  }, []);

  return null;
}
