import { Card } from './Card.jsx';
import { PageContainer } from './PageContainer.jsx';

export function PlaceholderPage({ title, description }) {
  return <PageContainer eyebrow="Batch 1 foundation" title={title} description={description}>
    <Card><p className="text-sm text-slate-500">This screen is ready for the next implementation batch.</p></Card>
  </PageContainer>;
}
