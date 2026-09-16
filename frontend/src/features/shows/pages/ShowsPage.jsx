import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { commerceApi } from '../../../api/commerce-api.js';
import { Card } from '../../../components/Card.jsx';
import { PageContainer } from '../../../components/PageContainer.jsx';
import { Button } from '../../../components/Button.jsx';
export function ShowsPage() { const [shows, setShows] = useState([]); const [error, setError] = useState(''); useEffect(() => { commerceApi.catalog().then((r) => setShows(r.data.shows)).catch(() => setError('Unable to load shows.')); }, []); return <PageContainer eyebrow="Now showing" title="Choose your show" description="Pick a screen, then choose the tier that fits your evening.">{error && <p className="text-red-600">{error}</p>}<div className="grid gap-5 md:grid-cols-2">{shows.map((show) => <Card key={show.id}><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-coral">{show.movie.language}</p><h2 className="mt-2 font-['Space_Grotesk'] text-2xl font-bold">{show.movie.title}</h2><p className="mt-2 text-sm text-slate-500">{show.screen.cinemaId.name} · {show.screen.name}</p></div><CalendarDays className="text-coral" /></div><p className="mt-5 text-sm text-slate-500">{new Date(show.startsAt).toLocaleString()}</p><Link to={`/shows/${show.id}/tickets`} className="mt-5 inline-block"><Button>Choose tickets</Button></Link></Card>)}</div></PageContainer>; }
