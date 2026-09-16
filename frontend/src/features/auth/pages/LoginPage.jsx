import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/Card.jsx';
import { PageContainer } from '../../../components/PageContainer.jsx';
import { Button } from '../../../components/Button.jsx';
import { useAuth } from '../../../app/auth-context.jsx';

export function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState('');
  async function submit(event) { event.preventDefault(); setError(''); try { await login(form); navigate(new URLSearchParams(location.search).get('redirect') || '/dashboard'); } catch (err) { setError(err.response?.data?.error?.message || 'Unable to sign in.'); } }
  return <PageContainer eyebrow="Welcome back" title="Sign in to Screenline" description="Your membership and booking history travel with your account."><Card className="max-w-md"><form onSubmit={submit} className="space-y-4">{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<input required type="email" className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input required type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><Button className="w-full">Sign in</Button><p className="text-sm text-slate-500">New here? <Link className="font-semibold text-coral" to="/signup">Create an account</Link></p></form></Card></PageContainer>;
}
