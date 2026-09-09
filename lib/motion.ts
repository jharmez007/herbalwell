/** Shared overlay lock. Nested overlays cannot accidentally unlock one another. */
let locks = 0;
let previousOverflow = '';
export function lockBodyScroll() {
  if (locks++ === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.overlayOpen = 'true';
    document.dispatchEvent(new Event('bhw:overlay'));
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) {
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.overlayOpen;
      document.dispatchEvent(new Event('bhw:overlay'));
    }
  };
}
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
