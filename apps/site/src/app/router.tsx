import { FullCalendar } from '@okampus/ui/molecules';
import { createBrowserRouter } from 'react-router-dom';
import { AdminEventDashboard } from './views/AdminEventDashboard';
import { ErrorPage } from './views/ErrorPage';
import { EventManage } from './views/EventManage';
import { TeamDashboard } from './views/TeamDashboard';
import { TeamList } from './views/TeamList';
import TenantApp from './views/TenantApp';
import { TreasuryView } from './views/TreasuryView';
import WelcomePage from './views/WelcomePage';
import { WIP } from './views/WIP';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TenantApp />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/events',
        element: <FullCalendar />,
      },
      {
        path: '/admin',
        element: <WIP />,
      },
      {
        path: '/clubs',
        element: <TeamList />,
      },
      {
        path: '/people',
        element: <WIP />,
      },
      {
        path: '/staff',
        element: <WIP />,
      },
      {
        path: '/admin/clubs',
        element: <TeamDashboard />,
      },
      {
        path: '/admin/settings',
        element: <WIP />,
      },
      {
        path: '/admin/roles',
        element: <WIP />,
      },
      {
        path: '/admin/staff',
        element: <WIP />,
      },
      {
        path: '/admin/validations',
        element: <WIP />,
      },
      {
        path: '/admin/events',
        element: <AdminEventDashboard />,
      },
      {
        path: '/:orgId/manage',
        element: <WIP />,
      },
      {
        path: '/:orgId/manage/events',
        element: <EventManage />,
      },
      {
        path: '/:orgId/manage/treasury',
        element: <TreasuryView />,
      },
      {
        path: '/:orgId/manage/settings',
        element: <WIP />,
      },
      {
        path: '/:orgId/manage/invite',
        element: <WIP />,
      },
      {
        path: '/:orgId/manage/org',
        element: <WIP />,
      },
      {
        path: '/:orgId/manage/roles',
        element: <WIP />,
      },
    ],
  },
  {
    path: '/welcome',
    element: <WelcomePage />,
  },
]);
