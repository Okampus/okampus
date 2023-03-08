import { AdminEventDashboard } from './views/AdminEventDashboard';
import { ErrorPage } from './views/ErrorPage';
import { TeamDashboard } from './views/TeamDashboard';
import { TeamCategoryList } from './views/TeamCategoryList';
import { WelcomePage } from './views/Welcome/WelcomePage';
import { TenantApp } from './views/TenantApp';
import { WIP } from './views/WIP';
import { GuideView } from './views/GuideView';
import { GuideManageView } from './views/Admin/GuideManageView';
import { TeamManageView } from './views/TeamManage/TeamManageView';
import { TeamList } from './views/TeamList';
import { TeamView } from './views/Team/TeamView';
import { UserProfile } from './views/User/UserProfile';

import { MyRoute, TeamManageRoute, TeamRoute, UserRoute } from './menus';

import { MyView } from './views/Me/MyView';
import { FullCalendar } from '@okampus/ui/molecules';
import { createBrowserRouter, Navigate } from 'react-router-dom';

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
        path: '/clubs',
        element: <TeamCategoryList />,
      },
      {
        path: '/clubs/:categorySlug',
        element: <TeamList />,
      },
      // {
      //   path: '/org/:orgSlug',
      //   element: <TeamProfile />,
      //   id: TeamProfileRoute.Profile,
      // },
      // {
      //   path: '/org/:orgSlug/events',
      //   element: <TeamProfile />,
      //   id: TeamProfileRoute.Events,
      // },
      // {
      //   path: '/org/:orgSlug/galleries',
      //   element: <TeamProfile />,
      //   id: TeamProfileRoute.Galleries,
      // },
      {
        path: '/org/:orgSlug',
        element: <Navigate to={TeamRoute.Profile} replace={true} />,
      },
      {
        path: '/org/:orgSlug/:tab',
        element: <TeamView />,
      },
      {
        path: '/manage/:manageOrgSlug',
        element: <Navigate to={TeamManageRoute.Overview} replace={true} />,
      },
      {
        path: '/manage/:manageOrgSlug/:tab',
        element: <TeamManageView />,
      },
      // {
      //   path: '/manage/:manageOrgSlug/documents',
      //   element: <DocumentManageView />,
      //   id: ManageTeamProfileRoute.Documents,
      // },
      // {
      //   path: '/manage/:manageOrgSlug/events',
      //   element: <EventManageView />,
      //   id: ManageTeamProfileRoute.Events,
      // },
      // {
      //   path: '/manage/:manageOrgSlug/treasury',
      //   element: <FinanceManageView />,
      //   id: ManageTeamProfileRoute.Treasury,
      // },
      // {
      //   path: '/manage/:manageOrgSlug/settings',
      //   element: <WIP />,
      // },
      // {
      //   path: '/manage/:manageOrgSlug/invite',
      //   element: <WIP />,
      //   id: ManageTeamProfileRoute.TeamJoin,
      // },
      // {
      //   path: '/manage/:manageOrgSlug/org',
      //   element: <WIP />,
      // },
      // {
      //   path: '/manage/:manageOrgSlug/roles',
      //   element: <WIP />,
      // },
      {
        path: '/user/:userSlug',
        element: <Navigate to={UserRoute.Profile} replace={true} />,
      },
      {
        path: '/user/:userSlug/:tab',
        element: <UserProfile />,
      },
      {
        path: '/me',
        element: <Navigate to={MyRoute.Profile} replace={true} />,
      },
      {
        path: '/me/:tab',
        element: <MyView />,
      },
    ],
  },
  {
    path: '/welcome',
    element: <WelcomePage />,
  },
]);
