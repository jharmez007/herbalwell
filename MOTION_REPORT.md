# Motion enhancement report

## Direction and scope

Refined editorial entrances, quiet botanical drift and immediate control feedback. Existing routes, business information, placeholder status, ordering messages, contact validation and metadata were preserved. No public deployment was made.

No animation library or other dependency was added or removed. CSS custom properties define 160ms interactions, 260ms transitions, 540ms reveals, 75ms stagger and 9–12-second decorative cycles. Normal entrances travel 16–18px; the bottle floats 4px on desktop. Press feedback uses 0.98 scale. There is no cursor parallax, magnetic interaction, artificial counter, price counting, loading screen or perpetual CTA pulse.

## Implementation

New files:

- `components/motion.tsx`: `Reveal` supports fade-up/in/left/right, bounded delay/duration and once/repeat behavior. `MotionController` shares reveal observation across server-rendered sections; a separate observer pauses decorative movement outside the viewport. `ScrollAffordances` observes the page-top sentinel and primary CTA to control header depth and sticky ordering.
- `lib/motion.ts`: reference-counted scroll locking for overlapping overlays.
- `app/motion.css`: motion tokens, responsive effects, native disclosure interpolation, reduced-motion overrides and tab-inactivity handling.
- `tests/motion-mocks.ts`, `tests/motion.test.tsx`: observer/media-query mocks and new behavior tests.

Modified files:

- `components/interactive.tsx`: animated mobile menu, focus containment/restoration, Escape/history/desktop-resize handling, age-dialog exit and scroll lock, native `FAQItem`, quantity feedback, gallery transitions and two decorative leaf shapes.
- `components/ui.tsx`: product reveal wrappers and FAQ item composition.
- `app/layout.tsx`: motion controller, scroll sentinel, stylesheet and sticky-order controller.
- `tests/setup.ts`, `tests/components.test.tsx`: browser API mocks and waiting for the deliberate age-dialog exit.
- `README.md`: current motion documentation link and verification status.

All pages and the root layout remain server components. Small client components receive rendered content as children; no page-wide client boundary or animation dependency was introduced.

## Route-by-route changes

| Route | Motion |
| --- | --- |
| `/` | Staggered hero entrance, product entrance/desktop float, drifting decorative leaves, trust/benefit reveals, opposite-side product spotlight reveals, connected order steps, small why-us groups and one-time footer groups. Ingredient placeholder remains static. |
| `/product` | Product entrance, gallery-image fade when photos exist, section-heading/information reveals, immediate quantity-value feedback and native FAQ motion. Unit price remains static because it does not change with quantity; no unverified total is invented. |
| `/faq` | Brief introduction entrance, animated native disclosures, disclosure-icon rotation and CTA reveal. |
| `/contact` | Intro/contact-aside reveal, focus-within label/border feedback, validation and prepared-message entrance; no asynchronous loading state because no asynchronous submission exists. |
| `/shipping-returns` | Intro and draft-notice entrance; policy paragraphs remain stable. |
| `/privacy` | Intro and draft-notice entrance; policy paragraphs remain stable. |
| `/terms` | Intro and draft-notice entrance; policy paragraphs remain stable. |
| `/disclaimer` | Intro entrance; disclaimer and warning text remain readable and are not part of staggered reveals. |
| Custom 404 | Brief intro entrance and normal shared controls. |

Shared header, menu, age notice, footer groups and mobile sticky ordering apply throughout. Route exit animations were intentionally skipped to preserve native App Router navigation and history behavior; page introductions and section entrances provide feedback without delaying navigation.

## Accessibility and fallback behavior

Content is visible in the server response and stays available before an observer fires. Reveals add motion without an opacity-zero pending state. Missing Intersection Observer falls back to static visible content. Focused reveal content cancels its entrance.

`prefers-reduced-motion` disables CSS animations/transitions, floating, decorative cycles, translation feedback and smooth scrolling. Reveals become immediately available; the preference is also observed at runtime. Age confirmation closes immediately without an animated delay in reduced-motion mode. Decorative elements are aria-hidden, clipped inside the product container and ignore pointer input. Desktop floating and glow are removed on mobile. CSS animations pause when the document is hidden; decorative animations pause outside the viewport.

The native age dialog retains modal focus handling and the original Escape policy. Focus starts on acceptance; scroll remains locked during the 180ms exit and restores after close. The original age text and `bhw-adult=true` storage behavior are unchanged. The mobile menu makes main/footer/other header controls inert, focuses the first navigation link, cycles keyboard focus, closes with Escape, restores focus, releases scrolling on history navigation and closes when resized to desktop. The sticky action is inert/hidden until the primary CTA has passed and is hidden throughout either overlay.

FAQ controls remain native details/summary with synchronized `aria-expanded` and `aria-controls`. Supporting browsers animate intrinsic content height using `::details-content` and `interpolate-size`; other browsers retain immediate native disclosure. No custom keyboard replacement was added merely to accommodate jsdom limitations.

## Performance and bundle measurement

Production `.next/static/chunks` JavaScript files were measured before and after, summing each file's raw bytes and Node gzip bytes:

| Measure | Before | After | Increase |
| --- | ---: | ---: | ---: |
| All emitted JavaScript, raw | 603,152 B | 609,406 B | 6,254 B |
| All emitted JavaScript, gzip | 186,714 B | 189,436 B | 2,722 B |

These totals are aggregate emitted JavaScript, not a measured initial route network payload. The added motion stylesheet source is approximately 12 KB raw / 3 KB gzip before production CSS minification. The stylesheet is shared and cached. No images or animation packages were downloaded for this phase. Observers replace continuous scroll calculations, and there are no requestAnimationFrame loops or mousemove handlers. Layout-affecting animation is limited to deliberate FAQ expansion; entrances use transforms/opacity.

Actual frame rate, Core Web Vitals and CLS were not measured in a browser. Mobile performance cannot be certified from source and bundle checks alone.

## Verification

- `npm run lint`: passed, zero introduced warnings.
- `npm run typecheck`: passed.
- `npm test`: 31 tests passed across three files, including all original 17 tests.
- `npm run build`: passed; every existing route remains prerendered.
- `node tests/routes.mjs`: all 14 HTTP checks passed against the local production server, including route status, metadata, security headers and absent unconfigured registration information.

Fourteen new tests cover visible reveal defaults, once/repeat observation, initial/live reduced-motion preferences, API fallback, observer cleanup/inactive tabs, menu keyboard cycling/Escape/focus/scroll restoration, desktop resizing, history navigation, age focus/exit/reduced motion, nested scroll locks, FAQ disclosure state and sticky ordering around overlays. Existing quantity, WhatsApp encoding, contact and compliance tests still pass.

The browser runtime reported `No browser is available`, then an empty browser list. Therefore no route was visually inspected in a browser; no screenshots were captured. The requested 320, 375, 430, 768, 1024 and 1440px viewports, landscape orientation, browser modal containment, real FAQ keyboard behavior, no-JS layout, no horizontal overflow, image cropping, flicker, hydration console and real-device smoothness remain unverified. Simulated DOM focus and observer tests are not substitutes for those checks. Lighthouse was not run and no scores are claimed.

## Preview and remaining checks

The local production preview runs at http://localhost:3001. To recreate it:

```sh
npm run build
npm run start -- --port 3001
```

For HMR development, run `npm run dev` and open the exact Local URL printed by Next.js (normally http://localhost:3000). No deployment is required.

When a browser becomes available, inspect every route at the six requested widths plus landscape. Test keyboard focus, menu open/close/history, quantity ordering, FAQ open/close and contact validation. Enable reduced motion in the operating system/browser and repeat. To view the age notice again, clear only `bhw-adult` in this site's local storage. Capture desktop/mobile home, product, mobile menu, age dialog and expanded FAQ screenshots. Run Lighthouse against the production preview if available. The existing business-content launch checklist remains applicable.
