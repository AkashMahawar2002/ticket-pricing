import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';

export function AppLayout() {
  return <div className="min-h-screen bg-mist"><Navbar /><div className="mx-auto flex max-w-7xl"><Sidebar /><div className="min-w-0 flex-1"><Outlet /></div></div></div>;
}
