import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout.jsx';
import { PlaceholderPage } from '../components/PlaceholderPage.jsx';
import { LoginPage } from '../features/auth/pages/LoginPage.jsx';
import { SignupPage } from '../features/auth/pages/SignupPage.jsx';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage.jsx';
import { CinemasPage } from '../features/cinemas/pages/CinemasPage.jsx';
import { ShowsPage } from '../features/shows/pages/ShowsPage.jsx';
import { TicketSelectionPage } from '../features/shows/pages/TicketSelectionPage.jsx';
import { ReviewPage } from '../features/shows/pages/ReviewPage.jsx';
import { BookingsPage } from '../features/bookings/pages/BookingsPage.jsx';
import { BookingDetailsPage } from '../features/bookings/pages/BookingDetailsPage.jsx';
import { ProfilePage } from '../features/profile/pages/ProfilePage.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { element: <AppLayout />, children: [
    { path: '/', element: <PlaceholderPage eyebrow="Screenline" title="Friday night, sorted" description="A calm counter for choosing the right cinema seat." /> },
    { element: <ProtectedRoute />, children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/cinemas', element: <CinemasPage /> },
      { path: '/shows', element: <ShowsPage /> },
      { path: '/shows/:showId/tickets', element: <TicketSelectionPage /> },
      { path: '/shows/:showId/review', element: <ReviewPage /> },
      { path: '/bookings', element: <BookingsPage /> },
      { path: '/bookings/:bookingId', element: <BookingDetailsPage /> },
      { path: '/profile', element: <ProfilePage /> }
    ]},
  ]}
]);
