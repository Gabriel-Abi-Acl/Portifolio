'use client';

import { useChat } from '@ai-sdk/react';
import { useLocale, useTranslations } from 'next-intl';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { GlassCard } from '@/components/shell/GlassCard';
import { CHAT_ERROR_CODE } from '@/lib/chat-errors';

const CHIPS = ['work', 'about', 'skills', 'contact'] as const;

type ChatPanelProps = {
  configured: boolean;
};

function messageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('')
    .trim();
}

function errorCode(error: Error | undefined): string | null {
  if (!error) {
    return null;
  }

  try {
    const parsed = JSON.parse(error.message) as { code?: unknown };
    return typeof parsed.code === 'string' ? parsed.code : null;
  } catch {
    return null;
  }
}

export function ChatPanel({ configured }: ChatPanelProps) {
  const t = useTranslations('chat');
  const locale = useLocale();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [input, setInput] = useState('');
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: { locale },
      }),
    [locale],
  );
  const { messages, sendMessage, status, error, clearError } = useChat({
    transport,
  });

  const busy = status === 'submitted' || status === 'streaming';
  const last = messages[messages.length - 1];
  const showThinking =
    configured &&
    (status === 'submitted' ||
      (status === 'streaming' &&
        (!last ||
          last.role !== 'assistant' ||
          messageText(last).length === 0)));
  const code = errorCode(error);
  const errorText = !error
    ? null
    : code === CHAT_ERROR_CODE.missingKey
      ? t('missingKey')
      : code === CHAT_ERROR_CODE.rateLimited
        ? t('rateLimited')
        : code === CHAT_ERROR_CODE.invalid
          ? t('invalid')
          : t('error');
  const sendDisabled = !configured || busy || input.trim().length === 0;

  useEffect(() => {
    const node = listRef.current;
    if (!node) {
      return;
    }

    node.scrollTop = node.scrollHeight;
  }, [messages, showThinking]);

  function fillChip(prompt: string) {
    if (!configured || busy) {
      return;
    }

    setInput(prompt);
    inputRef.current?.focus();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!configured || busy || !text) {
      return;
    }

    clearError();
    void sendMessage({ text });
    setInput('');
  }

  return (
    <GlassCard
      tone="strong"
      className="flex min-h-[28rem] flex-col px-4 py-4 sm:px-5 sm:py-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium tracking-tight">{t('title')}</h2>
      </div>

      {!configured ? (
        <p
          role="status"
          className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 text-muted"
        >
          {t('missingKey')}
        </p>
      ) : null}

      <div
        ref={listRef}
        role="log"
        aria-label={t('logLabel')}
        data-lenis-prevent
        className="mt-4 max-h-80 min-h-40 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1"
      >
        {messages.length === 0 && !showThinking ? (
          <p className="text-sm leading-6 text-muted">{t('empty')}</p>
        ) : null}

        {messages.map((message) => {
          const text = messageText(message);
          if (!text) {
            return null;
          }

          const mine = message.role === 'user';

          return (
            <div
              key={message.id}
              className={mine ? 'flex justify-end' : 'flex justify-start'}
            >
              <p
                className={
                  mine
                    ? 'max-w-[85%] rounded-2xl bg-accent/20 px-3.5 py-2 text-sm leading-6 whitespace-pre-wrap text-foreground'
                    : 'max-w-[85%] rounded-2xl bg-white/10 px-3.5 py-2 text-sm leading-6 whitespace-pre-wrap text-foreground'
                }
              >
                <span className="sr-only">
                  {mine ? t('you') : t('assistant')}{' '}
                </span>
                {text}
              </p>
            </div>
          );
        })}

        {showThinking ? (
          <p
            role="status"
            className="text-sm text-muted motion-safe:animate-pulse"
          >
            {t('thinking')}
          </p>
        ) : null}
      </div>

      {errorText ? (
        <p
          role="alert"
          className="mt-3 rounded-2xl border border-white/10 px-3 py-2 text-sm leading-6"
        >
          {errorText}
        </p>
      ) : null}

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="group"
        aria-label={t('chipsLabel')}
      >
        {CHIPS.map((id) => (
          <button
            key={id}
            type="button"
            disabled={!configured || busy}
            onClick={() => fillChip(t(`chips.${id}.prompt`))}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-foreground hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t(`chips.${id}.label`)}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
        <label className="sr-only" htmlFor={inputId}>
          {t('label')}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          value={input}
          maxLength={2000}
          disabled={!configured}
          autoComplete="off"
          placeholder={t('placeholder')}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sendDisabled}
          className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('send')}
        </button>
      </form>
    </GlassCard>
  );
}
