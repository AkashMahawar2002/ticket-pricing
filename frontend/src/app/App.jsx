import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { AuthProvider } from './auth-context.jsx';

export function App() {
  return <AuthProvider><RouterProvider router={router} /></AuthProvider>;
}
