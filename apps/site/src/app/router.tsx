import { AdminEventDashboard } from './views/AdminEventDashboard';
import { ErrorPage } from './views/ErrorPage';
import { EventManageView } from './views/TeamManage/EventManageView';
import { TeamDashboard } from './views/TeamDashboard';
import { TeamCategoryList } from './views/TeamCategoryList';
import { WelcomePage } from './views/Welcome/WelcomePage';
import { TenantApp } from './views/TenantApp';
import { FinanceManageView } from './views/TeamManage/FinanceManageView';
import { WIP } from './views/WIP';
import { GuideView } from './views/GuideView';
import { GuideManageView } from './views/AdminManage/GuideManageView';
import { DocumentManageView } from './views/TeamManage/DocumentManageView';
import { ProfileManageView } from './views/TeamManage/ProfileManageView';
import { TeamList } from './views/TeamList';
import { TeamProfile } from './views/TeamProfile';
import { UserProfile } from './views/User/UserProfile';
import { FullCalendar } from '@okampus/ui/molecules';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TenantApp />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/clubs',
        element: <TeamCategoryList />,
      },
      {
        path: '/clubs/:categorySlug',
        element: <TeamList />,
      },
      {
        path: '/events',
        element: <FullCalendar />,
      },
      {
        path: '/admin',
        element: <WIP />,
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
        path: '/org/:orgSlug',
        element: <TeamProfile />,
      },
      {
        path: '/org/:orgSlug/galleries',
        element: <TeamProfile />,
      },
      {
        path: '/org/:orgSlug/events',
        element: <TeamProfile />,
      },
      {
        path: '/manage/:manageOrgSlug',
        element: <ProfileManageView />,
      },
      {
        path: '/manage/:manageOrgSlug/profile',
        element: <ProfileManageView />,
      },
      {
        path: '/manage/:manageOrgSlug/documents',
        element: <DocumentManageView />,
      },
      {
        path: '/manage/:manageOrgSlug/events',
        element: <EventManageView />,
      },
      {
        path: '/manage/:manageOrgSlug/treasury',
        element: <FinanceManageView />,
      },
      {
        path: '/manage/:manageOrgSlug/settings',
        element: <WIP />,
      },
      {
        path: '/manage/:manageOrgSlug/invite',
        element: <WIP />,
      },
      {
        path: '/manage/:manageOrgSlug/org',
        element: <WIP />,
      },
      {
        path: '/manage/:manageOrgSlug/roles',
        element: <WIP />,
      },
      {
        path: '/user/:userSlug/',
        element: <UserProfile />,
      },
    ],
  },
  {
    path: '/welcome',
    element: <WelcomePage />,
  },
]);
