import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(() => { cleanup(); localStorage.clear(); });
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };

import { mediaQuery, MockObserver, resetMotionMocks } from './motion-mocks';
vi.stubGlobal('matchMedia', vi.fn(mediaQuery));
vi.stubGlobal('IntersectionObserver', MockObserver);
Object.defineProperty(HTMLElement.prototype, 'inert', { configurable: true,
  get() { return this.hasAttribute('inert'); },
  set(value: boolean) { this.toggleAttribute('inert', value); },
});
afterEach(resetMotionMocks);
