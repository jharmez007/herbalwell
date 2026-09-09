import { business } from './business';
export const defaultMessage = `Hello ${business.name}, I would like to order ${business.product.name}. Please send me the available delivery and payment details.`;
export function whatsappUrl(message = defaultMessage, number = business.whatsapp) {
  if (!/^\d{8,15}$/.test(number)) throw new Error('Configure a valid international WhatsApp number.');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export function orderMessage({ productName, quantity, price, pageUrl }: { productName: string; quantity: number; price?: number; pageUrl?: string }) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Quantity must be between 1 and 99.');
  let message = `Hello ${business.name}, I would like to order ${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${productName}. Please confirm the total price, payment method and delivery fee.`;
  if (price !== undefined && Number.isFinite(price) && price >= 0) message += ` Listed unit price: NGN ${price.toLocaleString('en-NG')}.`;
  if (pageUrl) { const url = new URL(pageUrl); if (['http:', 'https:'].includes(url.protocol)) message += ` Product page: ${url.origin}${url.pathname}`; }
  return message;
}
export type ContactValues = { name: string; contact: string; subject: string; message: string; consent: boolean; website: string };
export function validateContact(v: ContactValues) {
  const errors: Partial<Record<keyof ContactValues, string>> = {};
  if (v.name.trim().length < 2 || v.name.length > 80) errors.name = 'Enter your name (2–80 characters).';
  const contact = v.contact.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const validPhone = /^\+?[\d\s()-]{7,24}$/.test(contact) && /^\d{7,15}$/.test(contact.replace(/\D/g, ''));
  if (contact.length > 120 || (!validEmail && !validPhone)) errors.contact = 'Enter a valid email address or phone number.';
  if (!v.subject.trim() || v.subject.length > 100) errors.subject = 'Choose a subject.';
  if (v.message.trim().length < 10 || v.message.length > 1500) errors.message = 'Enter a message between 10 and 1,500 characters.';
  if (!v.consent) errors.consent = 'Please agree to share these details via WhatsApp.';
  if (v.website) errors.website = 'Unable to prepare your message.';
  return errors;
}
export const cleanText = (text: string) => text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
