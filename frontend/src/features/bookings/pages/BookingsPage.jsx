import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { commerceApi } from '../../../api/commerce-api.js';
import { Amount } from '../../../components/Amount.jsx';
import { Card } from '../../../components/Card.jsx';
import { PageContainer } from '../../../components/PageContainer.jsx';
export function BookingsPage() { const [bookings, setBookings] = useState([]); useEffect(() => { commerceApi.bookings().then((r) => setBookings(r.data.bookings)); }, []); return <PageContainer eyebrow="Your tickets" title="My bookings"><div className="space-y-3">{bookings.map((booking) => <Link key={booking.id} to={`/bookings/${booking.id}`}><Card className="flex items-center justify-between"><div><p className="font-semibold">{booking.status}</p><p className="text-sm text-slate-500">{new Date(booking.createdAt).toLocaleString()}</p></div><Amount paise={booking.totalPaise} /></Card></Link>)}{!bookings.length && <Card><p className="text-slate-500">No bookings yet.</p></Card>}</div></PageContainer>; }
