import { NavLink } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, MapPin, Ticket } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cinemas', label: 'Cinemas', icon: MapPin },
  { to: '/shows', label: 'Shows', icon: CalendarDays },
  { to: '/bookings', label: 'Bookings', icon: Ticket }
];

export function Sidebar() {
  return <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:block">
    <nav className="space-y-1">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-ink text-white' : 'text-slate-500 hover:bg-mist hover:text-ink'}`}><Icon size={17} />{label}</NavLink>)}</nav>
  </aside>;
}
