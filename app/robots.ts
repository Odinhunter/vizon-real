import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/diagnostic', '/profile', '/preview-results'],
      },
    ],
    sitemap: 'https://getvizon.com/sitemap.xml',
  };
}
