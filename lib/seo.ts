import type { Metadata } from 'next';
import { business } from './business';
export function siteOrigin() { if (!business.domain) return undefined; try { const url = new URL(business.domain); return ['https:', 'http:'].includes(url.protocol) ? url.origin : undefined; } catch { return undefined; } }
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const origin = siteOrigin();
  const url = origin ? `${origin}${path}` : undefined;
  return { title, description, alternates: url ? { canonical: url } : undefined, openGraph: { title: `${title} | ${business.name}`, description, type: 'website', locale: 'en_NG', siteName: business.name, url, images: origin ? [{ url: `${origin}${business.socialImage}`, width: 1536, height: 1024, alt: 'Blessing Herbal Wellness — Natural Wellness for Everyday Confidence' }] : undefined }, twitter: { card: 'summary_large_image', title, description, images: origin ? [`${origin}${business.socialImage}`] : undefined }, robots: origin ? { index: true, follow: true } : { index: false, follow: false } };
}
export function productSchema() { const p = business.product; return { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description, brand: { '@type': 'Brand', name: business.name }, ...(siteOrigin() ? { url: `${siteOrigin()}/product` } : {}), ...(p.images.length && siteOrigin() ? { image: p.images.map(im => new URL(im.src, siteOrigin()).href) } : {}), ...(p.priceVerified && p.stockVerified && siteOrigin() ? { offers: { '@type': 'Offer', price: p.price, priceCurrency: p.currency, availability: p.stock === 'IN STOCK' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${siteOrigin()}/product` } } : {}) }; }
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
