/** http(s) or a same-site path. Drops anything else, including protocol-relative URLs. */
export function presentProjectHref(
  href: string,
): { href: string; external: boolean } | null {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('\\')) {
    return null;
  }

  if (trimmed.startsWith('/')) {
    if (trimmed.includes('\\') || trimmed.split('/').includes('..')) {
      return null;
    }
    return { href: trimmed, external: false };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return null;
  }

  return { href: url.toString(), external: true };
}
