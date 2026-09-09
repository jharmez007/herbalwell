import { notFound } from 'next/navigation';
import { policies, type PolicySlug } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { WhatsAppOrderButton } from '@/components/interactive';
export function generateStaticParams() { return Object.keys(policies).map(policy => ({ policy })); }
export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }) { const { policy } = await params; const data = policies[policy as PolicySlug]; return data ? pageMetadata(data.title, data.intro, `/${policy}`) : {}; }
export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) { const { policy } = await params; if (!Object.hasOwn(policies, policy)) notFound(); const data = policies[policy as PolicySlug]; return <><section className="page-intro container"><span className="eyebrow">CLEAR INFORMATION. CONSIDERED CHOICES.</span><h1>{data.title}</h1><p>{data.intro}</p></section><article className="container narrow policy-content"><div className="draft-notice">Draft information · outstanding business details are explicitly marked below.</div>{data.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}<WhatsAppOrderButton enquiry="Hello Blessing Herbal Wellness, I have a question about your policies.">Ask about this policy</WhatsAppOrderButton></article></>; }
