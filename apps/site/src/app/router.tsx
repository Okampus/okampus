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
import { UserView } from './views/User/UserView';

import { MyView } from './views/Me/MyView';
import { ProjectList } from './views/Project/ProjectList';
import { ProjectView } from './views/Project/ProjectView';
import { EventView } from './views/Event/EventView';
import { EventList } from './views/Event/EventList';
import { EventManageView } from './views/EventManage/EventManageView';
import { EventConfirmPresenceView } from './views/EventManage/EventConfirmPresenceView';
import { EventValidationView } from './views/Admin/EventValidation/EventValidationView';
import {
  ADMIN_CLUBS,
  ADMIN_EVENTS,
  ADMIN_GUIDES,
  ADMIN_ROUTE,
  ADMIN_SETTINGS,
  BLOG_ROUTE,
  CLUBS_ROUTE,
  CLUB_CATEGORY_ROUTE,
  HOME_ROUTE,
  ME_ROUTES,
  PEOPLE_ROUTE,
  TEAM_MANAGE_ROUTE,
  TEAM_MANAGE_ROUTES,
  TEAM_MANAGE_TAB_ROUTE,
  TEAM_ROUTE,
  TEAM_ROUTES,
  TEAM_TAB_ROUTE,
  USER_ROUTE,
  USER_ROUTES,
  USER_TAB_ROUTE,
  ME_ROUTE,
  ME_TAB_ROUTE,
  DISCOVER_ROUTE,
  FAVORITES_ROUTE,
  PROJECT_ROUTE,
  PROJECT_ROUTES,
  PROJECT_TAB_ROUTE,
  PROJECTS_ROUTE,
  EVENT_ROUTE,
  EVENT_ROUTES,
  EVENT_TAB_ROUTE,
  EVENTS_ROUTE,
  EVENT_MANAGE_ROUTE,
  EVENT_MANAGE_ROUTES,
  EVENT_MANAGE_TAB_ROUTE,
  EVENT_JOIN_ID_PARAM,
  WELCOME_ROUTE,
  ADMIN_EVENTS_TAB_ROUTE,
  ADMIN_EVENTS_ROUTES,
} from '@okampus/shared/consts';

import { ErrorPage } from '@okampus/ui/templates';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import type { Router } from '@remix-run/router';

export const router: Router = createBrowserRouter([
  {
    path: '/',
    element: <TenantApp />,
    children: [
      {
        path: HOME_ROUTE,
        element: <TeamCategoryList />,
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
        element: <EventList />,
      },
      {
        path: PROJECTS_ROUTE,
        element: <ProjectList />,
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
        path: EVENT_ROUTE(),
        element: <Navigate to={EVENT_ROUTES.OVERVIEW} replace={true} />,
      },
      {
        path: EVENT_TAB_ROUTE(),
        element: <EventView />,
      },
      {
        path: EVENT_MANAGE_ROUTE(),
        element: <Navigate to={EVENT_MANAGE_ROUTES.OVERVIEW} replace={true} />,
      },
      {
        path: EVENT_MANAGE_TAB_ROUTE(),
        element: <EventManageView />,
      },
      {
        path: `${EVENT_MANAGE_TAB_ROUTE({ tab: EVENT_MANAGE_ROUTES.CONFIRM_PRESENCE })}/:${EVENT_JOIN_ID_PARAM}`,
        element: <EventConfirmPresenceView />,
      },
      {
        path: PROJECT_ROUTE(),
        element: <Navigate to={PROJECT_ROUTES.OVERVIEW} replace={true} />,
      },
      {
        path: PROJECT_TAB_ROUTE(),
        element: <ProjectView />,
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
        element: <UserView />,
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
        element: <Navigate to={ADMIN_EVENTS_ROUTES.OVERVIEW} replace={true} />,
      },
      {
        path: ADMIN_EVENTS_TAB_ROUTE(),
        element: <EventValidationView />,
      },
      {
        path: '*',
        element: <ErrorPage error="404" />,
      },
    ],
  },
  {
    path: WELCOME_ROUTE,
    element: <WelcomePage />,
  },
]);
