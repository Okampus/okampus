export const CATEGORY_SLUG_PARAM = 'categorySlug';
export const TEAM_SLUG_PARAM = 'teamSlug';
export const TEAM_MANAGE_SLUG_PARAM = 'manageTeamSlug';
export const USER_SLUG_PARAM = 'userSlug';
export const EVENT_SLUG_PARAM = 'eventSlug';
export const TAB_PARAM = 'tab';

export const HOME_ROUTE = '/home';
export const BLOG_ROUTE = '/blog';
export const PEOPLE_ROUTE = '/yearbook';
export const DISCOVER_ROUTE = '/discovery';
export const FAVORITES_ROUTE = '/favorites';

export const EVENT_ROUTE_PREFIX = '/event';
export const TEAM_ROUTE_PREFIX = '/team';
export const TEAM_MANAGE_ROUTE_PREFIX = '/manage';
export const USER_ROUTE_PREFIX = '/user';

export const ADMIN_ROUTE = '/admin';
export const ADMIN_CLUBS = `${ADMIN_ROUTE}/clubs`;
export const ADMIN_GUIDES = `${ADMIN_ROUTE}/guides`;
export const ADMIN_EVENTS = `${ADMIN_ROUTE}/events`;
export const ADMIN_SETTINGS = `${ADMIN_ROUTE}/settings`;
export const ADMIN_USERS = `${ADMIN_ROUTE}/roles`;

export const EVENTS_ROUTE = '/events';
export const EVENT_ROUTE = (slug?: string) => `${EVENT_ROUTE_PREFIX}/${slug ?? `:${EVENT_SLUG_PARAM}`}`;
export const EVENT_TAB_ROUTE = (slug?: string, tab?: string) => `${EVENT_ROUTE(slug)}/${tab ?? `:${TAB_PARAM}`}`;

export const PROJECTS_ROUTE = '/projects';

export const CLUBS_ROUTE = '/clubs';
export const CLUB_CATEGORY_ROUTE = (slug?: string) => `${CLUBS_ROUTE}/${slug ?? `:${CATEGORY_SLUG_PARAM}`}`;
export const TEAM_ROUTE = (slug?: string) => `${TEAM_ROUTE_PREFIX}/${slug ?? `:${TEAM_SLUG_PARAM}`}`;
export const TEAM_TAB_ROUTE = (slug?: string, tab?: string) => `${TEAM_ROUTE(slug)}/${tab ?? `:${TAB_PARAM}`}`;
export const TEAM_MANAGE_ROUTE = (slug?: string) =>
  `${TEAM_MANAGE_ROUTE_PREFIX}/${slug ?? `:${TEAM_MANAGE_SLUG_PARAM}`}`;
export const TEAM_MANAGE_TAB_ROUTE = (slug?: string, tab?: string) =>
  `${TEAM_MANAGE_ROUTE(slug)}/${tab ?? `:${TAB_PARAM}`}`;

export const USERS_ROUTE = '/users';
export const USER_ROUTE = (slug?: string) => `${USER_ROUTE_PREFIX}/${slug ?? `:${USER_SLUG_PARAM}`}`;
export const USER_TAB_ROUTE = (slug?: string, tab?: string) => `${USER_ROUTE(slug)}/${tab ?? `:${TAB_PARAM}`}`;

export const ME_ROUTE = '/me';
export const ME_TAB_ROUTE = (tab?: string) => `${ME_ROUTE}/${tab ?? `:${TAB_PARAM}`}`;

export enum TEAM_ROUTES {
  EVENTS = 'events',
  JOIN = 'join',
  GALLERIES = 'galleries',
  PROFILE = 'profile',
}

export enum TEAM_MANAGE_ROUTES {
  DOCUMENTS = 'documents',
  EVENTS = 'events',
  TEAM_JOIN = 'invite',
  TREASURY = 'treasury',
  OVERVIEW = 'overview',
  PROFILE = 'profile',
  ROLES = 'roles',
}

export enum USER_ROUTES {
  PROFILE = 'profile',
}

export enum ME_ROUTES {
  PROFILE = 'profile',
}
