import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? '')
    .join('')
    .toLocaleUpperCase();
}

export function localAvatarSrc(src: string): string | null {
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
