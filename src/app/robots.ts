import type { MetadataRoute } from 'next';
import { configuredSiteOrigin, siteOrigin } from '@/lib/site-origin';

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  const publicSite = configuredSiteOrigin() !== null;

  return {
    rules: publicSite
      ? { userAgent: '*', allow: '/', disallow: ['/api/'] }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${origin}/sitemap.xml`,
  };
}
