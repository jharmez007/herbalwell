import Link from 'next/link';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MotionController, Reveal, ScrollAffordances } from '@/components/motion';
import { AgeConfirmation, FAQItem, MobileNavigation } from '@/components/interactive';
import { lockBodyScroll } from '@/lib/motion';
import { intersect, observers, setMedia } from './motion-mocks';
const reduce = '(prefers-reduced-motion: reduce)';

describe('Progressive section motion', () => {
  it('keeps content visible before observation and reveals only once by default', () => {
    render(<><Reveal variant="fade-left" delay={75}><h2>Immediately readable</h2></Reveal><MotionController/></>);
    const element = screen.getByText('Immediately readable').parentElement!;
    expect(element).toBeVisible();
    expect(element).not.toHaveAttribute('aria-hidden');
    expect(element).toHaveAttribute('data-reveal', 'fade-left');
    act(() => intersect(element, true));
    expect(element).toHaveAttribute('data-revealed', 'true');
    act(() => intersect(element, false));
    expect(element).toHaveAttribute('data-revealed', 'true');
    expect(observers.every(observer => !observer.targets.has(element))).toBe(true);
  });
  it('supports repeat reveals without hiding content outside the viewport', () => {
    render(<><Reveal once={false}>Repeat</Reveal><MotionController/></>);
    const element = screen.getByText('Repeat');
    act(() => intersect(element, true)); expect(element).toHaveAttribute('data-revealed','true');
    act(() => intersect(element, false)); expect(element).not.toHaveAttribute('data-revealed'); expect(element).toBeVisible();
  });
  it('immediately reveals everything for reduced motion, including live preference changes', () => {
    render(<><Reveal>Always available</Reveal><MotionController/></>);
    act(() => setMedia(reduce, true));
    expect(screen.getByText('Always available')).toHaveAttribute('data-revealed','true');
    expect(screen.getByText('Always available')).toBeVisible();
  });
  it('handles reduced motion on initial hydration', () => {
    setMedia(reduce,true);
    render(<><Reveal>Reduced</Reveal><MotionController/></>);
    expect(screen.getByText('Reduced')).toHaveAttribute('data-revealed','true');
  });
  it('does not gate content when IntersectionObserver is unavailable', () => {
    const original = window.IntersectionObserver;
    Reflect.deleteProperty(window, 'IntersectionObserver');
    try {
      render(<><Reveal>Fallback</Reveal><MotionController/></>);
      expect(screen.getByText('Fallback')).toBeVisible();
      expect(screen.getByText('Fallback')).toHaveAttribute('data-revealed','true');
    } finally { window.IntersectionObserver = original; }
  });
  it('disconnects observers on unmount and stops decorative motion in inactive tabs', () => {
    const view = render(<MotionController/>);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    expect(document.documentElement.dataset.motionPaused).toBe('true');
    view.unmount(); expect(observers.every(observer => observer.targets.size === 0)).toBe(true); vi.restoreAllMocks();
  });
});

describe('Overlay focus and scroll behavior', () => {
  it('focuses first menu link, contains Tab, closes on Escape and restores scroll/background', async () => {
    const user = userEvent.setup();
    render(<><main>Page content</main><MobileNavigation/></>);
    const toggle = screen.getByRole('button',{name:'Menu'});
    await user.click(toggle);
    expect(screen.getByRole('link',{name:'Home'})).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.querySelector('main')).toHaveAttribute('inert');
    const order = screen.getByRole('link',{name:/Order via WhatsApp/}); order.focus();
    await user.tab(); expect(toggle).toHaveFocus();
    await user.tab({shift:true}); expect(order).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(toggle).toHaveFocus(); expect(toggle).toHaveAttribute('aria-expanded','false');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe(''); expect(document.querySelector('main')).not.toHaveAttribute('inert');
  });
  it('releases the mobile overlay when the viewport changes to desktop', async () => {
    const user = userEvent.setup(); render(<header className="header"><Link className="brand" href="/">Brand</Link><MobileNavigation/></header>);
    await user.click(screen.getByRole('button',{name:'Menu'}));
    act(() => setMedia('(min-width: 761px)',true));
    expect(document.body.style.overflow).toBe(''); expect(screen.getByRole('button',{name:'Menu'})).toHaveAttribute('aria-expanded','false'); expect(screen.getByRole('link',{name:'Brand'})).toHaveFocus();
  });
  it('closes the mobile overlay on browser history navigation', async () => {
    const user = userEvent.setup(); render(<MobileNavigation/>);
    await user.click(screen.getByRole('button',{name:'Menu'}));
    fireEvent(window, new PopStateEvent('popstate'));
    expect(screen.getByRole('button',{name:'Menu'})).toHaveFocus();
    expect(screen.getByRole('button',{name:'Menu'})).toHaveAttribute('aria-expanded','false');
    expect(document.body.style.overflow).toBe('');
  });
  it('focuses age confirmation and preserves Escape policy during the exit', async () => {
    const user = userEvent.setup(); render(<><main id="main" tabIndex={-1}>Page</main><AgeConfirmation/></>);
    const dialog = screen.getByRole('dialog'); const accept = screen.getByRole('button',{name:/I am 18/});
    expect(accept).toHaveFocus(); expect(document.body.style.overflow).toBe('hidden');
    const cancel = new Event('cancel',{cancelable:true}); fireEvent(dialog,cancel); expect(cancel.defaultPrevented).toBe(true);
    await user.click(accept); expect(dialog).toHaveAttribute('data-closing','true');
    expect(dialog).toHaveAttribute('open'); expect(document.body.style.overflow).toBe('hidden');
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    expect(document.body.style.overflow).toBe(''); expect(screen.getByRole('main')).toHaveFocus(); expect(localStorage.getItem('bhw-adult')).toBe('true');
  });
  it('closes immediately when reduced motion is selected', async () => {
    setMedia(reduce,true); const user = userEvent.setup(); render(<AgeConfirmation/>);
    const dialog = screen.getByRole('dialog'); await user.click(screen.getByRole('button',{name:/I am 18/}));
    expect(dialog).not.toHaveAttribute('open'); expect(dialog).not.toHaveAttribute('data-closing');
  });
  it('keeps a nested scroll lock until both overlays release it', () => {
    document.body.style.overflow='auto'; const a=lockBodyScroll();const b=lockBodyScroll();a();
    expect(document.body.style.overflow).toBe('hidden'); b(); expect(document.body.style.overflow).toBe('auto'); b();
  });
});
it('keeps native FAQ disclosure state and aria references synchronized on open and close', async () => {
  const user = userEvent.setup(); render(<FAQItem question="How?" answer="An answer." index={0}/>);
  const summary = screen.getByText('How?');
  expect(summary).toHaveAttribute('aria-expanded','false');
  expect(document.getElementById(summary.getAttribute('aria-controls')!)).toHaveTextContent('An answer.');
  await user.click(summary);
  expect(summary).toHaveFocus();
  await waitFor(() => expect(summary).toHaveAttribute('aria-expanded','true'));
  await user.click(summary); await waitFor(() => expect(summary).toHaveAttribute('aria-expanded','false'));
});
it('shows sticky ordering only after the primary CTA passes, hides it during overlays, and restores it afterward', () => {
  render(<><div id="site-top-sentinel"/><header className="header"/><div className="hero-actions">Primary</div><ScrollAffordances><a href="https://wa.me/2349127664894">Sticky order</a></ScrollAffordances></>);
  const sticky = screen.getByText('Sticky order').parentElement!;
  const sentinel = document.getElementById('site-top-sentinel')!;
  const primary = document.querySelector('.hero-actions')!;
  expect(sticky).toHaveAttribute('inert');
  act(() => { intersect(sentinel,false,-1); intersect(primary,true); });
  expect(sticky).toHaveAttribute('data-visible','false');
  act(() => intersect(primary,false,-1));
  expect(sticky).toHaveAttribute('data-visible','true'); expect(sticky).not.toHaveAttribute('inert');
  let release: () => void;
  act(() => { release=lockBodyScroll(); }); expect(sticky).toHaveAttribute('inert');
  act(() => release()); expect(sticky).toHaveAttribute('data-visible','true');
  act(() => intersect(primary,true)); expect(sticky).toHaveAttribute('data-visible','false');
});
