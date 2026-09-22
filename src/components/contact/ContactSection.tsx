import { getTranslations } from 'next-intl/server';
import { GlassCard } from '@/components/shell/GlassCard';
import type { Person } from '@/content/types';
import { presentEmail, presentHref } from '@/lib/links';
import { HOME_SECTIONS } from '@/lib/sections';

type ContactSectionProps = {
  person: Person;
};

type SocialLink = {
  id: string;
  label: string;
  href: string;
  external: boolean;
};

function socialLinks(person: Person): SocialLink[] {
  return person.socials.flatMap((social, index) => {
    const label = social.label.trim();
    const safe = presentHref(social.href);
    if (!label || !safe) {
      return [];
    }

    return [
      {
        id: social.id.trim() || `${safe.href}-${index}`,
        label,
        href: safe.href,
        external: safe.external,
      },
    ];
  });
}

export async function ContactSection({ person }: ContactSectionProps) {
  const t = await getTranslations('contact');
  const index = HOME_SECTIONS.findIndex((section) => section.id === 'contact');
  const label = String(index + 1).padStart(2, '0');
  const email = presentEmail(person.contactEmail);
  const links = socialLinks(person);

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="lg:col-span-2"
    >
      <GlassCard className="h-full px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="font-mono text-xs tracking-[0.18em] text-accent"
          >
            {label}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
          <p className="text-[0.7rem] font-medium tracking-[0.18em] text-muted uppercase">
            {t('kicker')}
          </p>
        </div>

        <h2
          id="contact-title"
          className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {t('title')}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          {t('intro')}
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium tracking-tight">
              {t('emailLabel')}
            </h3>
            {email ? (
              <div className="mt-3 flex flex-col items-start gap-3">
                <a
                  href={`mailto:${email}`}
                  className="text-sm break-all text-foreground underline-offset-4 hover:underline"
                >
                  {email}
                </a>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-[#06221c]"
                >
                  {t('emailCta')}
                </a>
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-muted">
                <span className="mr-2 text-[0.65rem] font-medium tracking-[0.14em] text-accent uppercase">
                  {t('placeholderBadge')}
                </span>
                {t('emailPlaceholder')}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-tight">
              {t('socialsLabel')}
            </h3>
            {links.length > 0 ? (
              <ul className="mt-3 flex flex-col items-start gap-2">
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                      {link.external ? (
                        <span className="sr-only"> ({t('newTab')})</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-muted">
                <span className="mr-2 text-[0.65rem] font-medium tracking-[0.14em] text-accent uppercase">
                  {t('placeholderBadge')}
                </span>
                {t('socialsPlaceholder')}
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
