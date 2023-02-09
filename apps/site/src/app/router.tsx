import { AdminEventDashboard } from './views/AdminEventDashboard';
import { ErrorPage } from './views/ErrorPage';
import { EventManageView } from './views/TeamManage/EventManageView';
import { TeamDashboard } from './views/TeamDashboard';
import { TeamList } from './views/TeamList';
import { WelcomePage } from './views/Welcome/WelcomePage';
import { TenantApp } from './views/TenantApp';
import { FinanceManageView } from './views/TeamManage/FinanceManageView';
import { WIP } from './views/WIP';
import { GuideManageView } from './views/AdminManage/GuideManageView';
import { GuideView } from './views/GuideView';
import { DocumentManageView } from './views/TeamManage/DocumentManageView';
import { FullCalendar } from '@okampus/ui/molecules';
import { createBrowserRouter } from 'react-router-dom';

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
        path: '/guides',
        element: <GuideView />,
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
        path: '/admin/guides',
        element: <GuideManageView />,
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
        path: '/:orgId/manage/documents',
        element: <DocumentManageView />,
      },
      {
        path: '/:orgId/manage/events',
        element: <EventManageView />,
      },
      {
        path: '/:orgId/manage/treasury',
        element: <FinanceManageView />,
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
