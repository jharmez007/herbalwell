import { vi } from 'vitest';
const queries = new Map<string, MediaQueryList>();
export function mediaQuery(query: string) {
  if (!queries.has(query)) {
    const target = new EventTarget();
    queries.set(query, Object.assign(target, { matches: false, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
    }) as unknown as MediaQueryList);
  }
  return queries.get(query)!;
}
export function setMedia(query: string, matches: boolean) {
  const media = mediaQuery(query);
  Object.defineProperty(media, 'matches', { value: matches, configurable: true });
  media.dispatchEvent(Object.assign(new Event('change'), { matches, media: query }));
}
export const observers: MockObserver[] = [];
export class MockObserver {
  targets = new Set<Element>();
  constructor(public callback: IntersectionObserverCallback, public options?: IntersectionObserverInit) { observers.push(this); }
  observe = (el: Element) => this.targets.add(el);
  unobserve = (el: Element) => this.targets.delete(el);
  disconnect = () => this.targets.clear();
  emit(el: Element, isIntersecting: boolean, bottom = 100) {
    if (!this.targets.has(el)) return;
    this.callback([{ target: el, isIntersecting, boundingClientRect: { bottom }, intersectionRatio: isIntersecting ? 1 : 0 } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}
export function intersect(el: Element, visible: boolean, bottom = 100) { observers.forEach(observer => observer.emit(el, visible, bottom)); }
export function resetMotionMocks() { queries.clear(); observers.length = 0; delete document.body.dataset.overlayOpen; delete document.documentElement.dataset.motionPaused; document.body.style.overflow = ''; }
