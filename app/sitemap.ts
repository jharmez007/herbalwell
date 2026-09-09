import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap { const origin = siteOrigin(); return origin ? ['', '/product', '/faq', '/contact', '/shipping-returns', '/privacy', '/terms', '/disclaimer'].map(path => ({ url: `${origin}${path}` })) : []; }
