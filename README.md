# Blessing Herbal Wellness

A responsive, one-product Nigerian wellness storefront. Orders and enquiries are explicitly handed off to WhatsApp. No database, admin dashboard, payment capture or simulated checkout.

## Stack and architecture

Next.js 16 App Router, React, TypeScript, npm, a responsive global CSS design system, native HTML details/dialog elements, Vitest and Testing Library. Server-rendered content is separated from the small client-side interaction layer. System Georgia and Arial fonts avoid external font downloads. Product imagery uses Next Image when photographs are configured. The current product illustration is clearly labelled as a placeholder, not actual packaging.

- `app/`: home, product, FAQs, contact, four policy pages via `[policy]`, custom 404, metadata, robots, sitemap and generated icons.
- `components/ui.tsx`: brand mark, header, footer, social links, section headings, FAQ accordion, product card, ingredients, order steps, disclaimer, conditional compliance fields and disabled testimonials.
- `components/interactive.tsx`: mobile navigation, product gallery, quantity selector, WhatsApp button, order panel, age confirmation and contact form.
- `lib/business.ts`: central typed business/product configuration.
- `lib/content.ts`: FAQs and draft policy copy.
- `lib/whatsapp.ts`: ordering, URL encoding and contact validation.
- `lib/seo.ts`: canonical URLs and evidence-aware structured data.
- `tests/`: unit and interaction tests.

## Run locally

Use Node.js 20.9+ (Node 22 LTS recommended) and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open the Local URL printed by Next.js, normally http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`npm start` serves the production build. There is no backend service to configure for enquiries.

## Configuration

Edit `lib/business.ts` for the brand, product, price, stock, package size, WhatsApp, email, Instagram, hours, delivery areas, logo, social image, legal business name, optional compliance fields and analytics ID. Edit `lib/content.ts` for FAQs and final approved policies.

Environment variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Verified absolute public origin, e.g. your HTTPS domain. No invented domain is provided. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits-only international number; defaults to the supplied `2349127664894`. |

These values are public and are captured at build time. Never place private credentials in `NEXT_PUBLIC_*` variables. Rebuild after changing them. Until a valid domain is configured, the site is noindex, robots disallows crawling, canonicals/social image URLs are omitted and the sitemap has no URLs. Configure the real domain only after reviewing launch content. No analytics code is installed; the optional configuration field alone does not enable tracking. Implement and review consent before adding analytics.

### Product and images

The supplied ₦35,000, 500ml and IN STOCK entries are provisional, explicitly labelled. Set `priceVerified` and `stockVerified` only after verification. Update stock text to the actual status. Structured data omits offers until price, stock and origin are verified/configured. No ratings, reviews or invented identifiers are included. Only fill compliance fields with verified real values; empty fields, including NAFDAC, render nothing.

Replace the temporary text brand mark by adding a final logo under `public/` and setting `business.logo`. Add appropriately compressed local product photos (WebP/AVIF suggested) and populate `product.images` with `{ src: '/product-front.webp', alt: 'Accurate description' }`. The gallery automatically uses them with responsive Next Image optimisation. Do not present illustrative packaging as real photography. Add verified ingredients with names, factual descriptions, formulation roles and optional local image paths. Supply directions, contraindications and storage from the verified label; do not invent dosage.

The original user-provided performance description is retained in `suppliedDescription` for review, but deliberately not published because supporting evidence was not provided. Conservative wellness principles are not represented as proven product outcomes.

`public/og.png` is a bespoke, visually checked social-sharing image generated with the built-in image generation tool. Prompt: “Premium landscape social sharing card for Blessing Herbal Wellness; forest green #173c2e, warm ivory #f6f3e9, restrained gold #b49760; refined editorial serif and clean sans-serif; exact brand name, ‘Natural Wellness for Everyday Confidence’, and ‘For adults 18+’; botanical shadow accents; no bottles, ingredients, medical claims, seals, certifications or people.” It is decorative branding, not formulation evidence. App icons are generated text monograms; add the final approved brand assets when ready.

### Ordering and contact privacy

Every order link uses the configured number. Product order links contain quantity and only verified price; clicked product buttons add the current origin/path without query strings or fragments. Default buttons use the exact supplied message. The quantity range is 1–99. There is no analytics tracking.

The form validates fields, lengths and consent, and uses a hidden honeypot. It creates a URL locally and displays “not sent” with a separate link to review and send in WhatsApp. Editing the form invalidates the prepared link. Values are not saved to local storage or a website database. WhatsApp processes them under its own policies. Do not enter sensitive health or card information. A honeypot reduces unsophisticated automated use; there is no public form submission endpoint to spam. If a backend is added, add server-side validation, rate limits and secret-backed anti-spam protection; client checks alone are insufficient.

The age dialog uses native modal focus containment and makes background content inert. Escape does not bypass confirmation. The exit button leaves the site. The only persistent browser state is `bhw-adult=true`; clear browser site data to reset. This is not robust age verification or a substitute for legal compliance.

## Deployment

Deploy as a standard Next.js Node application on a host supporting Next.js 16 (for example Vercel), or run `npm ci && npm run build` followed by `npm start` behind an HTTPS reverse proxy. Set environment variables in the host’s dashboard, use the exact lockfile, verify the build and preview every route before enabling the public domain. Ensure the platform retains the configured security headers. Do not use a static-only host without adapting image optimisation and runtime routes.

Sites hosting was assessed; its Cloudflare Worker artifact contract does not directly accept this standard Next.js build. This repository honours the explicit Next.js stack requirement and does not include a fabricated Sites deployment. A separate tested adapter is required for that platform.

## Before launch

- [ ] Replace provisional product information and confirm the actual product name/package size.
- [ ] Add real product photographs and the final logo.
- [ ] Add verified ingredients and formulation roles.
- [ ] Add verified directions, contraindications, warnings and storage instructions.
- [ ] Verify the current price and stock, then enable their verification flags.
- [ ] Test the supplied WhatsApp number and every order button with quantities.
- [ ] Add business email, Instagram URL, operating hours and legal business identity.
- [ ] Confirm delivery areas, fees, dispatch timelines and discreet packaging arrangements.
- [ ] Finalise returns, cancellations, refund eligibility and processing times.
- [ ] Add NAFDAC registration details only if supplied and valid; verify any other compliance fields.
- [ ] Review privacy policy and terms, including hosting logs, retention, rights procedures and third-party transfers.
- [ ] Set the verified HTTPS domain; inspect canonicals, social cards, sitemap and robots after rebuilding.
- [ ] Test all routes and age-dialog keyboard focus on a real mobile device, tablet and desktop.
- [ ] Run Lighthouse/accessibility checks and test at 320px and with 200% zoom.
- [ ] Confirm any payment provider permits the product category before integrating one.
- [ ] Obtain appropriate legal/regulatory review.

No approval, certification, clinical validation, testimonials or guaranteed outcomes are claimed. Draft legal text and general cautionary copy are not legal or medical advice. Business verification and regulatory review remain necessary before a public commercial launch.

## Editorial review references

General caution around herbal medicine interactions was checked against the [NHS herbal medicines guidance](https://www.nhs.uk/tests-and-treatments/herbal-medicines-and-complementary-therapies/). This is not evidence for POWER ZOOX or Nigerian registration. For qualified local review, consult the [NDPC’s Nigeria Data Protection Act publication](https://www.ndpc.gov.ng/ndp-act-2023/) and the [FCCPC’s published consumer-protection legislation](https://fccpc.gov.ng/wp-content/uploads/2022/07/FCCPA-2018.pdf). The draft policies intentionally do not invent business-specific terms or claim compliance.

## Validation result

Lint, TypeScript checking, all 17 unit/interaction tests, and the Next.js 16.3.4 production build passed. All eight content routes returned 200; the custom unknown route returned 404; robots, sitemap, both generated icons and the social image returned 200. Route checks also asserted security headers, page headings/titles and absent unconfigured NAFDAC information.

To repeat the production HTTP checks, run `npm run build`, then `npm run start -- --port 3001` in one terminal and `npm run test:routes` in another. Set `TEST_ORIGIN` if using a different address.

The browser runtime reported no available browser. Consequently screenshots, actual viewport resizing, Lighthouse, real-browser modal focus containment and real-device tests were not completed. Responsive rules cover 320px, 360px, 760px and 1050px breakpoints, but source review is not a visual conformance test. The modal and navigation interactions passed simulated DOM tests. No claim of fully verified WCAG 2.2 AA or Lighthouse scores is made. See `IMPLEMENTATION_REPORT.md` for handoff details.
# herbalwell

## Motion enhancement

The site now uses dependency-free CSS motion with Intersection Observer, accessible overlay scroll/focus management, reduced-motion fallbacks and a conditional sticky WhatsApp action. Timing tokens live in `app/motion.css`; reusable reveal and observer controls are in `components/motion.tsx`. All 31 automated tests pass. See [MOTION_REPORT.md](./MOTION_REPORT.md) for the route-by-route changes, measured bundle impact, test results, preview steps and outstanding browser/viewport checks. The earlier 17-test validation section records the initial release; this report covers the enhancement phase. No public deployment was performed.
