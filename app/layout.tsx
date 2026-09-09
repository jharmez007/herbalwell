import type { Metadata } from 'next';
import { business } from '@/lib/business';
import { pageMetadata, jsonLd, siteOrigin } from '@/lib/seo';
import { Header, Footer } from '@/components/ui';
import { AgeConfirmation, WhatsAppOrderButton } from '@/components/interactive';
import './globals.css';
export const metadata: Metadata = { ...pageMetadata('Natural Wellness for Everyday Confidence', 'Discover Blessing Herbal Wellness: thoughtful herbal wellness for adult men in Nigeria, with clear information and discreet WhatsApp ordering.', '/'), metadataBase: siteOrigin() ? new URL(siteOrigin()!) : undefined, title: { default: business.name, template: `%s | ${business.name}` } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en-NG"><body><a href="#main" className="skip-link">Skip to content</a><Header/><main id="main" tabIndex={-1}>{children}</main><Footer/><div className="mobile-sticky"><span>Personal. Discreet.</span><WhatsAppOrderButton>Order via WhatsApp</WhatsAppOrderButton></div><AgeConfirmation/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ '@context': 'https://schema.org', '@type': 'Organization', name: business.name, ...(siteOrigin() ? { url: siteOrigin() } : {}), ...(business.instagram ? { sameAs: [business.instagram] } : {}) }) }}/></body></html>; }
