import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blends/',
          '/journal/',
          '/legal/',
          '/assets/',
        ],
        disallow: [
          '/admin/',
          '/api/orders/',
          '/api/customers/',
        ],
      },
    ],
    sitemap: 'https://kindleaf.in/sitemap.xml',
  };
}
