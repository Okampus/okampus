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

import { MyView } from './views/Me/MyView';
import { FullCalendar } from '@okampus/ui/molecules';
import {
  ADMIN_CLUBS,
  ADMIN_EVENTS,
  ADMIN_GUIDES,
  ADMIN_ROUTE,
  ADMIN_SETTINGS,
  BLOG_ROUTE,
  CLUBS_ROUTE,
  CLUB_CATEGORY_ROUTE,
  EVENTS_ROUTE,
  HOME_ROUTE,
  TEAM_MANAGE_TAB_ROUTE,
  ME_ROUTES,
  PEOPLE_ROUTE,
  TEAM_MANAGE_ROUTE,
  TEAM_MANAGE_ROUTES,
  TEAM_ROUTE,
  TEAM_ROUTES,
  TEAM_TAB_ROUTE,
  USER_ROUTES,
  USER_ROUTE,
  USER_TAB_ROUTE,
  ME_ROUTE,
  ME_TAB_ROUTE,
  DISCOVER_ROUTE,
  FAVORITES_ROUTE,
  PROJECTS_ROUTE,
} from '@okampus/shared/consts';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TenantApp />,
    errorElement: <ErrorPage error="404" />,
    children: [
      {
        path: HOME_ROUTE,
        element: <GuideView />,
      },
      {
        path: BLOG_ROUTE,
        element: <GuideView />,
      },
      {
        path: PEOPLE_ROUTE,
        element: <WIP />,
      },
      {
        path: DISCOVER_ROUTE,
        element: <WIP />,
      },
      {
        path: FAVORITES_ROUTE,
        element: <WIP />,
      },
      {
        path: EVENTS_ROUTE,
        element: <FullCalendar />,
      },
      {
        path: PROJECTS_ROUTE,
        element: <WIP />,
      },
      {
        path: CLUBS_ROUTE,
        element: <TeamCategoryList />,
      },
      {
        path: CLUB_CATEGORY_ROUTE(),
        element: <TeamList />,
      },
      {
        path: TEAM_ROUTE(),
        element: <Navigate to={TEAM_ROUTES.PROFILE} replace={true} />,
      },
      {
        path: TEAM_TAB_ROUTE(),
        element: <TeamView />,
      },
      {
        path: TEAM_MANAGE_ROUTE(),
        element: <Navigate to={TEAM_MANAGE_ROUTES.PROFILE} replace={true} />,
      },
      {
        path: TEAM_MANAGE_TAB_ROUTE(),
        element: <TeamManageView />,
      },
      {
        path: USER_ROUTE(),
        element: <Navigate to={USER_ROUTES.PROFILE} replace={true} />,
      },
      {
        path: USER_TAB_ROUTE(),
        element: <UserProfile />,
      },
      {
        path: ME_ROUTE,
        element: <Navigate to={ME_ROUTES.PROFILE} replace={true} />,
      },
      {
        path: ME_TAB_ROUTE(),
        element: <MyView />,
      },
      {
        path: ADMIN_ROUTE,
        element: <WIP />,
      },
      {
        path: ADMIN_CLUBS,
        element: <TeamDashboard />,
      },
      {
        path: ADMIN_GUIDES,
        element: <GuideManageView />,
      },
      {
        path: ADMIN_SETTINGS,
        element: <WIP />,
      },
      {
        path: ADMIN_EVENTS,
        element: <AdminEventDashboard />,
      },
    ],
  },
  {
    path: '/welcome',
    element: <WelcomePage />,
  },
]);
