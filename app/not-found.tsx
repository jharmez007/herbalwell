import Link from 'next/link';
export const metadata = { title: 'Page not found', robots: { index: false, follow: false } };
export default function NotFound() { return <section className="container page-intro not-found"><span className="eyebrow">404 · A SMALL DETOUR</span><h1>Let’s get you<br/>back to wellness.</h1><p>We couldn’t find that page. Your next step is just below.</p><Link className="button" href="/">Back to home →</Link><Link className="text-link" href="/product">Explore POWER ZOOX →</Link></section>; }
