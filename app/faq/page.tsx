import { FAQAccordion, FinalCTA } from '@/components/ui';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('Frequently asked questions', 'Find answers about POWER ZOOX, discreet ordering, delivery, product directions, medication considerations and returns.', '/faq');
export default function FAQPage() { return <><section className="page-intro container"><span className="eyebrow">HERE TO HELP YOU FEEL INFORMED</span><h1>A little clarity<br/>goes a long way.</h1><p>Thoughtful answers to your questions about our product, ordering and care.</p></section><section className="container narrow section compact-section"><FAQAccordion/></section><FinalCTA/></>; }
