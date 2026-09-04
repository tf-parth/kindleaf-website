import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  
  const productEntries: MetadataRoute.Sitemap = (products || []).map((p: any) => ({
    url: `https://kindleaf.in/blends/${p.slug || (p.weight?.includes('200') ? 'herbal-green-tea-combo' : 'herbal-green-tea-natural')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://kindleaf.in',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...productEntries,
    {
      url: 'https://kindleaf.in/journal',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://kindleaf.in/legal',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}
