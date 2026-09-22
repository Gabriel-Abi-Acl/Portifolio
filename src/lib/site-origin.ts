const LOCAL_ORIGIN = 'http://localhost:3000';

/** Public origin from NEXT_PUBLIC_SITE_URL, or null when it is missing or invalid. */
export function configuredSiteOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? '';
  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }
    if (url.username || url.password) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

/** Configured origin, or the local dev origin so sitemap URLs stay absolute. */
export function siteOrigin(): string {
  return configuredSiteOrigin() ?? LOCAL_ORIGIN;
}
