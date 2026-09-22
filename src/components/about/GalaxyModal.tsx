'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { setScrollLocked } from '@/lib/scroll-lock';
import { GalaxyStill } from './GalaxyStill';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function SceneLoading() {
  const t = useTranslations('about');
  return <GalaxyStill status={t('loading')} />;
}

const GalaxyScene = dynamic(
  () => import('./GalaxyScene').then((mod) => mod.GalaxyScene),
  { ssr: false, loading: SceneLoading },
);

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function GalaxyModal() {
  const t = useTranslations('about');
  const titleId = useId();
  const hintId = useId();
  const dialogId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);

    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setScrollLocked(true);

    const hidden: Element[] = [];
    for (const child of Array.from(document.body.children)) {
      if (panel && (child === panel || child.contains(panel))) continue;
      if (child.hasAttribute('inert')) continue;
      child.setAttribute('inert', '');
      hidden.push(child);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);

      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    panel?.querySelector<HTMLButtonElement>('[data-close-dialog]')?.focus();

    return () => {
      media.removeEventListener('change', sync);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      hidden.forEach((el) => el.removeAttribute('inert'));
      setScrollLocked(false);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#06221c] shadow-[0_10px_30px_rgb(62_224_197/0.22)] transition hover:brightness-110"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => {
          setReduceMotion(prefersReducedMotion());
          setOpen(true);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 1.2l1.1 3.4L12.6 5 9.1 6.6 8 10 6.9 6.6 3.4 5l3.5-.4L8 1.2zM12.2 9.2l.6 1.7 1.7.5-1.7.6-.6 1.7-.5-1.7-1.7-.6 1.7-.5.5-1.7z"
            fill="currentColor"
          />
        </svg>
        {t('explore')}
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6"
              onMouseDown={() => setOpen(false)}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#05040c]/78"
              />
              <div
                ref={panelRef}
                id={dialogId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={hintId}
                tabIndex={-1}
                className="glass-card glass-card-strong relative flex h-[min(86dvh,680px)] w-full max-w-4xl flex-col"
                style={{
                  backdropFilter: 'blur(var(--blur-glass))',
                  WebkitBackdropFilter: 'blur(var(--blur-glass))',
                }}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <h2
                    id={titleId}
                    className="text-lg font-semibold tracking-tight"
                  >
                    {t('dialogTitle')}
                  </h2>
                  <button
                    type="button"
                    data-close-dialog=""
                    className="rounded-full border border-white/15 px-3 py-1.5 text-sm"
                    onClick={() => setOpen(false)}
                  >
                    {t('close')}
                  </button>
                </div>

                <div className="relative min-h-0 flex-1 bg-[#070612]">
                  {reduceMotion ? (
                    <GalaxyStill />
                  ) : (
                    <GalaxyScene label={t('sceneLabel')} />
                  )}
                </div>

                <p
                  id={hintId}
                  className="px-5 py-4 text-sm leading-6 text-muted sm:px-6"
                >
                  {reduceMotion ? t('reducedHint') : t('hint')}
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
