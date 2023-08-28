export const INDIVIDUAL_SLUG_PARAM = 'userSlug';

export const CATEGORY_SLUG_PARAM = 'categorySlug';
export const TEAM_SLUG_PARAM = 'teamSlug';
export const TEAM_MANAGE_SLUG_PARAM = 'manageTeamSlug';

export const PROJECT_SLUG_PARAM = 'projectSlug';
export const PROJECT_MANAGE_SLUG_PARAM = 'manageProjectSlug';

export const EVENT_SLUG_PARAM = 'eventSlug';
export const EVENT_MANAGE_SLUG_PARAM = 'manageEventSlug';

export const EVENT_JOIN_ID_PARAM = 'joinId';

export const TAB_PARAM = 'tab';

export const WELCOME_ROUTE = '/welcome';

export const HOME_ROUTE = '/home';
export const BLOG_ROUTE = '/blog';
export const PEOPLE_ROUTE = '/yearbook';
export const DISCOVER_ROUTE = '/discovery';
export const FAVORITES_ROUTE = '/favorites';

export const EVENT_ROUTE_PREFIX = '/event';
export const EVENT_MANAGE_ROUTE_PREFIX = '/manage-event';

export const TEAM_ROUTE_PREFIX = '/team';
export const TEAM_MANAGE_ROUTE_PREFIX = '/manage';

export const PROJECT_ROUTE_PREFIX = '/project';
export const PROJECT_MANAGE_ROUTE_PREFIX = '/manage-project';

export const USER_ROUTE_PREFIX = '/user';

export const ADMIN_ROUTE = '/admin';
export const ADMIN_CLUBS = `${ADMIN_ROUTE}/clubs`;
export const ADMIN_GUIDES = `${ADMIN_ROUTE}/guides`;
export const ADMIN_EVENTS = `${ADMIN_ROUTE}/events`;
export const ADMIN_EVENTS_TAB_ROUTE = (tab?: string) => `${ADMIN_EVENTS}/${tab ?? `:${TAB_PARAM}`}`;

export enum ADMIN_EVENTS_ROUTES {
  OVERVIEW = 'overview',
  APPROVAL_STEPS = 'approval-steps',
}

export const ADMIN_SETTINGS = `${ADMIN_ROUTE}/settings`;
export const ADMIN_USERS = `${ADMIN_ROUTE}/roles`;

export const ME_ROUTE = '/me';
export const ME_TAB_ROUTE = (tab?: string) => `${ME_ROUTE}/${tab ?? `:${TAB_PARAM}`}`;

export type SlugTabRoute = { slug?: string; tab?: string };

export const USERS_ROUTE = '/users';
export const USER_ROUTE = (slug?: string) => `${USER_ROUTE_PREFIX}/${slug ?? `:${INDIVIDUAL_SLUG_PARAM}`}`;
export const USER_TAB_ROUTE = (slugTab?: SlugTabRoute) =>
  `${USER_ROUTE(slugTab?.slug)}/${slugTab?.tab ?? `:${TAB_PARAM}`}`;

export const EVENTS_ROUTE = '/events';
export const EVENT_ROUTE = (slug?: string) => `${EVENT_ROUTE_PREFIX}/${slug ?? `:${EVENT_SLUG_PARAM}`}`;
export const EVENT_TAB_ROUTE = (slugTab?: SlugTabRoute) =>
  `${EVENT_ROUTE(slugTab?.slug)}/${slugTab?.tab ?? `:${TAB_PARAM}`}`;

export const EVENT_MANAGE_ROUTE = (slug?: string) =>
  `${EVENT_MANAGE_ROUTE_PREFIX}/${slug ?? `:${EVENT_MANAGE_SLUG_PARAM}`}`;
export const EVENT_MANAGE_TAB_ROUTE = (slugTab?: SlugTabRoute) =>
  `${EVENT_MANAGE_ROUTE(slugTab?.slug)}/${slugTab?.tab ?? `:${TAB_PARAM}`}`;

export const PROJECTS_ROUTE = '/projects';
export const PROJECT_ROUTE = (slug?: string) => `${PROJECT_ROUTE_PREFIX}/${slug ?? `:${PROJECT_SLUG_PARAM}`}`;
export const PROJECT_TAB_ROUTE = (slugTab?: SlugTabRoute) =>
  `${PROJECT_ROUTE(slugTab?.slug)}/${slugTab?.tab ?? `:${TAB_PARAM}`}`;

export const PROJECT_MANAGE_ROUTE = (slug?: string) =>
  `${PROJECT_MANAGE_ROUTE_PREFIX}/${slug ?? `:${PROJECT_MANAGE_SLUG_PARAM}`}`;
export const PROJECT_MANAGE_TAB_ROUTE = (slugTab?: SlugTabRoute) =>
  `${PROJECT_MANAGE_ROUTE(slugTab?.slug)}/${slugTab?.tab ?? `:${TAB_PARAM}`}`;

export const CLUBS_ROUTE = '/clubs';
export const CLUB_CATEGORY_ROUTE = (slug?: string) => `${CLUBS_ROUTE}/${slug ?? `:${CATEGORY_SLUG_PARAM}`}`;
export const TEAM_ROUTE = (slug?: string) => `${TEAM_ROUTE_PREFIX}/${slug ?? `:${TEAM_SLUG_PARAM}`}`;
export const TEAM_TAB_ROUTE = (slugTab?: SlugTabRoute) =>
  `${TEAM_ROUTE(slugTab?.slug)}/${slugTab?.tab ?? `:${TAB_PARAM}`}`;

export const TEAM_MANAGE_ROUTE = (slug?: string) =>
  `${TEAM_MANAGE_ROUTE_PREFIX}/${slug ?? `:${TEAM_MANAGE_SLUG_PARAM}`}`;
export const TEAM_MANAGE_TAB_ROUTE = (slugTab?: SlugTabRoute) =>
  `${TEAM_MANAGE_ROUTE(slugTab?.slug)}/${slugTab?.tab ?? `:${TAB_PARAM}`}`;

export enum USER_ROUTES {
  PROFILE = 'profile',
}

export enum ME_ROUTES {
  PROFILE = 'profile',
}

export enum TEAM_ROUTES {
  EVENTS = 'events',
  PROJECTS = 'projects',
  JOIN = 'join',
  GALLERIES = 'galleries',
  PROFILE = 'profile',
}

export enum TEAM_MANAGE_ROUTES {
  OVERVIEW = 'overview',
  DOCUMENTS = 'documents',
  EVENTS = 'events',
  TEAM_JOIN = 'invite',
  TREASURY = 'treasury',
  PROFILE = 'profile',
  PROJECTS = 'projects',
  ROLES = 'roles',
}

export enum EVENT_ROUTES {
  OVERVIEW = 'overview',
  ROLES = 'roles',
}

export enum EVENT_MANAGE_ROUTES {
  OVERVIEW = 'overview',
  ATTENDANCE = 'attendance',
  CONFIRM_PRESENCE = 'confirm-presence',
}

export enum PROJECT_ROUTES {
  OVERVIEW = 'overview',
  ROLES = 'roles',
  EVENTS = 'events',
}
