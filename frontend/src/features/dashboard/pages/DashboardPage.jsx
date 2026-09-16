import { Link } from 'react-router-dom';
import { ArrowRight, Film } from 'lucide-react';
import { Button } from '../../../components/Button.jsx';
import { Card } from '../../../components/Card.jsx';
import { PageContainer } from '../../../components/PageContainer.jsx';

export function DashboardPage() {
  return <PageContainer eyebrow="Counter dashboard" title="A better seat starts here" description="Your cinema workspace is ready for shows, tiers, and transparent ticket totals."><div className="grid gap-5 md:grid-cols-2"><Card className="bg-ink text-white"><Film className="mb-8 text-coral" size={28} /><h2 className="font-['Space_Grotesk'] text-2xl font-bold">Browse tonight's shows</h2><p className="mt-2 text-slate-300">Find a cinema and choose the seats that suit your evening.</p><Link to="/shows" className="mt-6 inline-block"><Button className="bg-coral hover:bg-orange-500">Explore shows <ArrowRight className="ml-2 inline" size={16} /></Button></Link></Card><Card><p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Foundation ready</p><h2 className="mt-3 font-['Space_Grotesk'] text-2xl font-bold">Pricing with clarity</h2><p className="mt-2 text-slate-500">The detailed bill and membership-aware pricing engine arrive in the next batches.</p></Card></div></PageContainer>;
}
