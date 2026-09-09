export type Ingredient = { name: string; image: string | null; description: string; role: string };
export type Product = {
  name: string; price: number; priceVerified: boolean; currency: 'NGN'; packageSize: string;
  stock: string; stockVerified: boolean; description: string; suppliedDescription: string;
  images: { src: string; alt: string }[]; ingredients: Ingredient[]; directions: string | null;
  warnings: string | null; storage: string | null;
  compliance: Partial<Record<'nafdac' | 'batch' | 'manufactured' | 'expires' | 'manufacturer', string>>;
};
export const business = {
  name: 'Blessing Herbal Wellness', tagline: 'Rooted in nature. Made for your everyday.',
  announcement: 'A personal approach to wellness. Discreet ordering on WhatsApp.',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2349127664894',
  email: null as string | null, instagram: null as string | null,
  deliveryAreas: [] as string[], hours: null as string | null,
  logo: null as string | null, socialImage: '/og.png',
  legalName: null as string | null, domain: process.env.NEXT_PUBLIC_SITE_URL || '',
  analyticsId: null as string | null,
  product: {
    name: 'POWER ZOOX', price: 35000, priceVerified: false, currency: 'NGN', packageSize: '500ml',
    stock: 'IN STOCK', stockVerified: false,
    description: 'A herbal wellness product for adult men, thoughtfully presented for your everyday routine.',
    // Supplied marketing claim is retained for owner review, not published without evidence.
    suppliedDescription: 'A Natural Formula to Boost Performance, Stamina and Drive',
    images: [], ingredients: [], directions: null, warnings: null, storage: null, compliance: {},
  } satisfies Product as Product,
};
export const disclaimer = 'For adults 18+. This product is not intended to diagnose, treat, cure or prevent any disease.';
export const money = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
export const navLinks = [['Home', '/'], ['Product', '/product'], ['FAQs', '/faq'], ['Contact', '/contact']] as const;
export const policyLinks = [['Shipping & returns', '/shipping-returns'], ['Privacy policy', '/privacy'], ['Terms & conditions', '/terms'], ['Health disclaimer', '/disclaimer']] as const;
