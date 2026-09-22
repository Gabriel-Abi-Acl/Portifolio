import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/site-origin';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const languages = {
    'pt-BR': `${origin}/`,
    en: `${origin}/en`,
    'x-default': `${origin}/`,
  };

  return [
    {
      url: `${origin}/`,
      alternates: { languages },
    },
    {
      url: `${origin}/en`,
      alternates: { languages },
    },
  ];
}
