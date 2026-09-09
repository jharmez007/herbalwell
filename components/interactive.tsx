'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { business, money, navLinks } from '@/lib/business';
import { cleanText, orderMessage, validateContact, whatsappUrl, type ContactValues } from '@/lib/whatsapp';

export function WhatsAppOrderButton({ quantity, children = 'Order via WhatsApp', className = '', enquiry }: { quantity?: number; children?: React.ReactNode; className?: string; enquiry?: string }) {
  const message = enquiry || (quantity ? orderMessage({ productName: business.product.name, quantity, price: business.product.priceVerified ? business.product.price : undefined }) : undefined);
  return <a className={`button ${className}`} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" onClick={e => {
    if (quantity) e.currentTarget.href = whatsappUrl(orderMessage({ productName: business.product.name, quantity, price: business.product.priceVerified ? business.product.price : undefined, pageUrl: window.location.href }));
  }}><span aria-hidden="true">↗</span> {children}</a>;
}
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  return <div className="mobile-navigation" onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }}>
    <button className="menu-toggle" ref={toggle} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? 'Close ×' : 'Menu ☰'}</button>
    {open && <nav id="mobile-menu" aria-label="Mobile navigation">{navLinks.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}<WhatsAppOrderButton /></nav>}
  </div>;
}
export function QuantitySelector({ quantity, onChange }: { quantity: number; onChange: (n: number) => void }) {
  return <div className="quantity" role="group" aria-label="Order quantity"><button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => onChange(quantity - 1)}>−</button><output aria-live="polite" aria-label="Quantity">{quantity}</output><button type="button" aria-label="Increase quantity" disabled={quantity >= 99} onClick={() => onChange(quantity + 1)}>+</button></div>;
}
export function OrderPanel() {
  const [quantity, setQuantity] = useState(1);
  const p = business.product;
  return <div className="order-panel"><div className="price-line"><strong>{money(p.price)}</strong><span>/ {p.packageSize}</span><span className="stock">● {p.stock}{!p.stockVerified && ' · provisional'}</span></div>
    {(!p.priceVerified || !p.stockVerified) && <p className="small muted">Provisional product details · confirm current price, package size and availability before payment.</p>}
    <div className="order-controls"><QuantitySelector quantity={quantity} onChange={setQuantity} /><WhatsAppOrderButton quantity={quantity} /></div><p className="small muted">One-to-one ordering. Payment & delivery confirmed in chat.</p></div>;
}
export function ProductGallery({ hero = false }: { hero?: boolean }) {
  const [active, setActive] = useState(0);
  const images = business.product.images;
  if (!images.length) return <div className={`product-visual ${hero ? 'hero-visual' : ''}`}><span className="visual-top">THE EVERYDAY WELLNESS COLLECTION</span><div className="visual-orbit" aria-hidden="true"/><div className="bottle" role="img" aria-label="Illustrative packaging placeholder for POWER ZOOX; not actual product packaging"><div className="bottle-cap"/><div className="bottle-body"><div className="bottle-label"><span className="bottle-brand">Blessing<br/><small>HERBAL WELLNESS</small></span><span className="bottle-rule"/><strong>POWER<br/>ZOOX</strong><span className="bottle-sub">HERBAL WELLNESS<br/>FOR ADULT MEN</span><span className="bottle-size">500ml · 18+</span></div></div></div><div className="visual-bottom"><span>ROOTED IN NATURE</span><span>01 / 01</span></div><p className="placeholder-caption">Packaging illustration · product photo pending</p></div>;
  return <div className="gallery"><Image src={images[active].src} alt={images[active].alt} width={720} height={820} sizes="(max-width: 760px) 100vw, 50vw" priority={hero}/>{images.length > 1 && <div className="gallery-thumbs">{images.map((im, i) => <button key={im.src} onClick={() => setActive(i)} aria-label={`View product image ${i + 1}`} aria-pressed={active === i}><Image src={im.src} alt="" width={70} height={80}/></button>)}</div>}</div>;
}
export function AgeConfirmation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const accept = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let confirmed = false;
    try { confirmed = localStorage.getItem('bhw-adult') === 'true'; } catch { /* Storage may be disabled. */ }
    if (!confirmed) { dialog.current?.showModal(); accept.current?.focus(); }
  }, []);
  const confirm = () => { try { localStorage.setItem('bhw-adult', 'true'); } catch { /* Confirmation lasts for this session. */ } dialog.current?.close(); document.getElementById('main')?.focus(); };
  return <dialog ref={dialog} className="age-dialog" aria-labelledby="age-title" aria-describedby="age-copy" onCancel={e => e.preventDefault()}><div className="eyebrow">A MOMENT BEFORE YOU BEGIN</div><h2 id="age-title">Wellness for adults.</h2><p id="age-copy">Blessing Herbal Wellness provides products intended for adults aged 18 and above. Please confirm that you are at least 18.</p><button className="button" ref={accept} onClick={confirm}>I am 18 or older <span aria-hidden="true">→</span></button><a className="leave-link" href="https://www.google.com/" rel="noreferrer">Leave website</a><p className="small muted">Your confirmation is saved only on this device.</p></dialog>;
}
export function ContactForm() {
  const [errors, setErrors] = useState<ReturnType<typeof validateContact>>({});
  const [prepared, setPrepared] = useState('');
  const errorSummary = useRef<HTMLDivElement>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values: ContactValues = { name: String(data.get('name') || ''), contact: String(data.get('contact') || ''), subject: String(data.get('subject') || ''), message: String(data.get('message') || ''), consent: data.get('consent') === 'on', website: String(data.get('website') || '') };
    const next = validateContact(values); setErrors(next); setPrepared('');
    if (Object.keys(next).length) { setTimeout(() => errorSummary.current?.focus(), 0); return; }
    setPrepared(whatsappUrl(`Hello ${business.name},\nName: ${cleanText(values.name)}\nContact: ${cleanText(values.contact)}\nSubject: ${cleanText(values.subject)}\n${cleanText(values.message)}`));
  }
  return <form className="contact-form" onSubmit={submit} noValidate onChange={() => setPrepared('')}>
    <h2>Let’s talk wellness.</h2><p>Prepare an enquiry, then send it through WhatsApp. Please leave out sensitive health information.</p>
    {Object.keys(errors).length > 0 && <div className="form-error" ref={errorSummary} tabIndex={-1} role="alert">Please check the following: <ul>{Object.entries(errors).map(([key, error]) => <li key={key}><a href={`#${key}`}>{error}</a></li>)}</ul></div>}
    <div className="form-row">{[['name', 'Your name', 'text', 80], ['contact', 'Email or phone', 'text', 120]].map(([name, label, type, max]) => <label key={name} htmlFor={String(name)}>{label}<input id={String(name)} name={String(name)} type={String(type)} maxLength={Number(max)} autoComplete={name === 'name' ? 'name' : 'off'} required aria-invalid={!!errors[name as keyof ContactValues]} aria-describedby={errors[name as keyof ContactValues] ? `${name}-error` : undefined}/>{errors[name as keyof ContactValues] && <span className="field-error" id={`${name}-error`}>{errors[name as keyof ContactValues]}</span>}</label>)}</div>
    <label htmlFor="subject">Subject<select id="subject" name="subject" required aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-error' : undefined}><option value="">Select a topic</option><option>Product enquiry</option><option>Delivery question</option><option>Existing order</option><option>Privacy enquiry</option><option>Something else</option></select>{errors.subject && <span id="subject-error" className="field-error">{errors.subject}</span>}</label>
    <label htmlFor="message">Your message<textarea name="message" id="message" rows={5} minLength={10} maxLength={1500} required aria-invalid={!!errors.message} aria-describedby="message-help message-error"/><span id="message-help" className="small muted">10–1,500 characters. No card details or medical history.</span><span id="message-error" className="field-error">{errors.message}</span></label>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website<input name="website" id="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="consent" htmlFor="consent"><input type="checkbox" id="consent" name="consent" required aria-invalid={!!errors.consent} aria-describedby="consent-error"/><span>I agree to share these details with the business through WhatsApp, as described in the <Link href="/privacy">privacy policy</Link>.</span></label><span id="consent-error" className="field-error">{errors.consent}</span>
    <button className="button" type="submit">Prepare WhatsApp message <span aria-hidden="true">→</span></button>
    {prepared && <div className="form-success" role="status"><strong>Your message is ready. It has not been sent.</strong><p>Open WhatsApp to review and send it yourself.</p><a className="button" href={prepared} target="_blank" rel="noopener noreferrer">Continue to WhatsApp ↗</a></div>}
  </form>;
}
