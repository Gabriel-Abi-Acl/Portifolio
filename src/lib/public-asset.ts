import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

/** Local file under `public/`, or null when the path is external or missing. */
export function localPublicSrc(src: string): string | null {
  const trimmed = src.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return null;
  }

  const relative = trimmed.slice(1);
  if (
    relative.length === 0 ||
    relative.includes('\\') ||
    relative.split('/').includes('..')
  ) {
    return null;
  }

  const publicDir = path.resolve(process.cwd(), 'public');
  const file = path.resolve(publicDir, relative);
  if (file !== publicDir && !file.startsWith(`${publicDir}${path.sep}`)) {
    return null;
  }

  try {
    if (!fs.statSync(file).isFile()) {
      return null;
    }
  } catch {
    return null;
  }

  return `/${relative}`;
}
