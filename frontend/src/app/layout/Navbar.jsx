import { Link } from 'react-router-dom';
import { Clapperboard, UserCircle } from 'lucide-react';
import { useAuth } from '../auth-context.jsx';

export function Navbar() {
  const { user, logout } = useAuth();
  return <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Link to="/" className="flex items-center gap-3 font-['Space_Grotesk'] text-lg font-bold text-ink">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-coral text-white"><Clapperboard size={18} /></span>
        Screenline
      </Link>
      <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
        <Link to="/bookings" className="hidden hover:text-ink sm:block">My bookings</Link>
        {user ? <button onClick={logout} className="hidden hover:text-ink sm:block">Log out</button> : <Link to="/login" className="hover:text-ink">Sign in</Link>}
        <Link to="/profile" aria-label="Profile" className="grid h-9 w-9 place-items-center rounded-full bg-mist hover:text-ink"><UserCircle size={19} /></Link>
      </div>
    </div>
  </header>;
}
