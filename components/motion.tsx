'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/** Content starts visible. Observation adds entrance motion, never a visibility gate. */
export function Reveal({ children, className = '', variant = 'fade-up', delay = 0, duration = 540, once = true }: {
  children: ReactNode; className?: string;
  variant?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right';
  delay?: number; duration?: number; once?: boolean;
}) {
  return <div className={className} data-reveal={variant} data-reveal-once={once}
    style={{ '--reveal-delay': `${Math.max(0, Math.min(delay, 400))}ms`, '--reveal-duration': `${Math.max(0, Math.min(duration, 1000))}ms` } as CSSProperties}>{children}</div>;
}

const revealSelectors = [
  '[data-reveal]', '.section-heading', '.trust-strip .container > span',
  '.benefits article', '.ingredient-grid article', '.steps', '.steps article',
  '.why-grid > div:first-child', '.why-list article', '.footer-grid > div',
  '.contact-grid > aside', '.information-grid article', '.final-cta',
].join(',');
const staggerSelectors = '.trust-strip .container, .benefits, .ingredient-grid, .steps, .why-list, .footer-grid';

/** One observer per route, shared by server-rendered sections and Reveal wrappers. */
export function MotionController() {
  const pathname = usePathname();
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors));
    document.querySelectorAll(staggerSelectors).forEach(group => {
      Array.from(group.children).forEach((child, index) => {
        (child as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(index, 4) * 75}ms`);
      });
    });
    let observer: IntersectionObserver | undefined;
    const visuals = Array.from(document.querySelectorAll<HTMLElement>('.product-visual'));
    const driftObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => { (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting); });
    }, { threshold: 0 }) : undefined;
    visuals.forEach(el => driftObserver?.observe(el));
    const revealAll = () => elements.forEach(el => { el.dataset.revealed = 'true'; });
    const start = () => {
      observer?.disconnect();
      if (media.matches || !('IntersectionObserver' in window)) { revealAll(); return; }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.dataset.revealed = 'true';
            if (el.dataset.revealOnce !== 'false') observer?.unobserve(el);
          } else if (el.dataset.revealOnce === 'false') delete el.dataset.revealed;
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
      elements.forEach(el => { if (el.dataset.revealed !== 'true' || el.dataset.revealOnce === 'false') observer?.observe(el); });
    };
    const onFocus = (event: FocusEvent) => {
      const el = (event.target as HTMLElement).closest<HTMLElement>('[data-revealed]');
      if (el) el.dataset.motionFocused = 'true';
    };
    const onVisibility = () => { document.documentElement.dataset.motionPaused = String(document.hidden); };
    start(); onVisibility();
    media.addEventListener('change', start);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { observer?.disconnect(); driftObserver?.disconnect(); media.removeEventListener('change', start); document.removeEventListener('focusin', onFocus); document.removeEventListener('visibilitychange', onVisibility); };
  }, [pathname]);
  return null;
}

/** Observers drive header depth and sticky ordering; no scroll or mousemove loop. */
export function ScrollAffordances({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const sticky = ref.current;
    const header = document.querySelector<HTMLElement>('.header');
    const sentinel = document.getElementById('site-top-sentinel');
    const primary = document.querySelector('.hero-actions, .product-detail .order-controls, .page-intro');
    if (!sticky) return;
    let scrolled = false;
    let primaryPassed = false;
    const update = () => {
      const visible = scrolled && primaryPassed && document.body.dataset.overlayOpen !== 'true';
      sticky.dataset.visible = String(visible);
      sticky.inert = !visible;
      sticky.setAttribute('aria-hidden', String(!visible));
    };
    update();
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === sentinel) {
          scrolled = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
          if (header) header.dataset.scrolled = String(scrolled);
        }
        if (entry.target === primary) primaryPassed = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
      }
      update();
    }, { threshold: 0 }) : undefined;
    if (sentinel) observer?.observe(sentinel);
    if (primary) observer?.observe(primary);
    document.addEventListener('bhw:overlay', update);
    return () => { observer?.disconnect(); document.removeEventListener('bhw:overlay', update); };
  }, [pathname]);
  return <div ref={ref} className="mobile-sticky" data-visible="false" inert aria-hidden="true">{children}</div>;
}
