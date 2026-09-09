import { describe, it, expect } from 'vitest';
import { orderMessage, whatsappUrl, defaultMessage, validateContact } from '@/lib/whatsapp';
import { business } from '@/lib/business';
import { productSchema, jsonLd } from '@/lib/seo';
describe('WhatsApp ordering', () => {
  it('uses supplied number and exact default message', () => { const url = new URL(whatsappUrl()); expect(url.pathname).toBe('/2349127664894'); expect(url.searchParams.get('text')).toBe(defaultMessage); });
  it('round trips punctuation, unicode, ampersands and newlines safely', () => { const message = 'Hello! 2 × POWER ZOOX & ₦35,000\nAny details? #thanks'; expect(new URL(whatsappUrl(message)).searchParams.get('text')).toBe(message); expect(whatsappUrl(message)).not.toContain(' '); });
  it('includes quantity and verified price while stripping query and hash', () => { const m = orderMessage({ productName: 'POWER ZOOX', quantity: 2, price: 35000, pageUrl: 'https://example.com/product?email=private#health' }); expect(m).toContain('2 units of POWER ZOOX'); expect(m).toContain('35,000'); expect(m).toContain('https://example.com/product'); expect(m).not.toMatch(/private|health|email/); });
  it('omits unspecified price and validates quantities and number', () => { expect(orderMessage({ productName: 'POWER ZOOX', quantity: 1 })).toContain('1 unit of'); expect(orderMessage({ productName: 'POWER ZOOX', quantity: 1 })).not.toContain('NGN'); for (const q of [0, 100, 1.5, NaN]) expect(() => orderMessage({ productName: 'P', quantity: q })).toThrow(); expect(() => whatsappUrl('hello', '+234 fake')).toThrow(); });
  it('does not publish unverified offers or invented ratings', () => { expect(productSchema()).not.toHaveProperty('offers'); expect(productSchema()).not.toHaveProperty('aggregateRating'); expect(business.product.compliance.nafdac).toBeUndefined(); });
  it('escapes script injection in structured data', () => { expect(jsonLd({ name: '</script>' })).not.toContain('<'); });
});
describe('Contact validation', () => {
  const valid = { name: 'Ada', contact: 'ada@example.com', subject: 'Product enquiry', message: 'Please confirm delivery.', consent: true, website: '' };
  it('accepts valid email or phone', () => { expect(validateContact(valid)).toEqual({}); expect(validateContact({ ...valid, contact: '+234 912 766 4894' })).toEqual({}); });
  it('rejects punctuation-only telephone input', () => { expect(validateContact({ ...valid, contact: '-------' })).toHaveProperty('contact'); });
  it('rejects missing consent, invalid contact, short message and honeypot', () => { const result = validateContact({ ...valid, consent: false, contact: 'bad', message: 'Hi', website: 'spam' }); expect(Object.keys(result)).toEqual(expect.arrayContaining(['contact','message','consent','website'])); });
});
