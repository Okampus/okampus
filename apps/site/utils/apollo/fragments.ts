import { getFragmentFromQuery } from './get-from-query';
import {
  GetUserDocument,
  GetMeDocument,
  GetTenantManageDocument,
  GetEventDocument,
  GetEventManageDocument,
  GetTeamDocument,
  GetTeamManageDocument,
  GetProjectDocument,
  GetProjectManageDocument,
} from '@okampus/shared/graphql';
import type {
  GetEventManageQueryResult,
  GetEventQueryResult,
  GetMeQueryResult,
  GetProjectManageQueryResult,
  GetProjectQueryResult,
  GetTeamManageQueryResult,
  GetTeamQueryResult,
  GetTenantManageQueryResult,
  GetUserQueryResult,
} from '@okampus/shared/graphql';

export const UserFragment = getFragmentFromQuery('User', GetUserDocument);
export const UserLoginFragment = getFragmentFromQuery('UserLogin', GetMeDocument);
export const TenantManageFragment = getFragmentFromQuery('Tenant', GetTenantManageDocument, 'TenantManage');
export const EventFragment = getFragmentFromQuery('Event', GetEventDocument);
export const EventManageFragment = getFragmentFromQuery('Event', GetEventManageDocument, 'EventManage');
export const TeamFragment = getFragmentFromQuery('Team', GetTeamDocument);
export const TeamManageFragment = getFragmentFromQuery('Team', GetTeamManageDocument, 'TeamManage');
export const ProjectFragment = getFragmentFromQuery('Project', GetProjectDocument);
export const ProjectManageFragment = getFragmentFromQuery('Project', GetProjectManageDocument, 'ProjectManage');

export type UserInfo = NonNullable<GetUserQueryResult['data']>['user'][number];
export type UserLoginInfo = NonNullable<GetMeQueryResult['data']>['me'];
export type TenantInfo = NonNullable<GetMeQueryResult['data']>['me']['user']['tenant'];
export type TenantManageInfo = NonNullable<GetTenantManageQueryResult['data']>['tenant'][number];
export type EventInfo = NonNullable<GetEventQueryResult['data']>['event'][number];
export type EventManageInfo = NonNullable<GetEventManageQueryResult['data']>['event'][number];
export type TeamInfo = NonNullable<GetTeamQueryResult['data']>['team'][number];
export type TeamManageInfo = NonNullable<GetTeamManageQueryResult['data']>['team'][number];
export type ProjectInfo = NonNullable<GetProjectQueryResult['data']>['project'][number];
export type ProjectManageInfo = NonNullable<GetProjectManageQueryResult['data']>['project'][number];

export function getUserWhere(user: { user: { actor: { slug: string } } }) {
  return { actor: { slug: user.user.actor.slug } };
}

export function getUserLoginWhere(userLogin: { user: { actor: { slug: string } } }) {
  return { user: { actor: { slug: userLogin.user.actor.slug } } };
}

export function getTenantWhere(tenant: { domain: string }) {
  return { domain: tenant.domain };
}

export function getEventWhere(event: { slug: string }) {
  return { slug: event.slug };
}

export function getTeamWhere(team: { actor: { slug: string } }) {
  return { actor: { slug: team.actor.slug } };
}

export function getProjectWhere(project: { slug: string }) {
  return { slug: project.slug };
}
