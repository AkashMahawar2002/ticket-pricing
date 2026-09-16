import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './auth-context.jsx';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-screen place-items-center text-slate-500">Loading your counter...</div>;
  return user ? <Outlet /> : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
}
