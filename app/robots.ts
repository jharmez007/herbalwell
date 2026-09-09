import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots { const origin = siteOrigin(); return { rules: { userAgent: '*', ...(origin ? { allow: '/' } : { disallow: '/' }) }, ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}) }; }
