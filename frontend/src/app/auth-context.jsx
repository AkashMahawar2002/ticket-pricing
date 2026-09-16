import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth-api.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { authApi.me().then((response) => setUser(response.data.user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const login = async (payload) => { const response = await authApi.login(payload); setUser(response.data.user); return response.data.user; };
  const signup = async (payload) => { const response = await authApi.signup(payload); setUser(response.data.user); return response.data.user; };
  const logout = async () => { await authApi.logout(); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
