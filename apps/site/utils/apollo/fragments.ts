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
export const MeFragment = getFragmentFromQuery('User', GetMeDocument, 'Me');
export const TenantManageFragment = getFragmentFromQuery('Tenant', GetTenantManageDocument, 'TenantManage');
export const EventFragment = getFragmentFromQuery('Event', GetEventDocument);
export const EventManageFragment = getFragmentFromQuery('Event', GetEventManageDocument, 'EventManage');
export const TeamFragment = getFragmentFromQuery('Team', GetTeamDocument);
export const TeamManageFragment = getFragmentFromQuery('Team', GetTeamManageDocument, 'TeamManage');
export const ProjectFragment = getFragmentFromQuery('Project', GetProjectDocument);
export const ProjectManageFragment = getFragmentFromQuery('Project', GetProjectManageDocument, 'ProjectManage');

export type MeInfo = NonNullable<NonNullable<GetMeQueryResult['data']>['getCurrentUser']>;
export type TenantInfo = MeInfo['originalTenantScope'];
export type UserInfo = NonNullable<GetUserQueryResult['data']>['user'][number];
export type TenantManageInfo = NonNullable<GetTenantManageQueryResult['data']>['tenant'][number];
export type EventInfo = NonNullable<GetEventQueryResult['data']>['event'][number];
export type EventManageInfo = NonNullable<GetEventManageQueryResult['data']>['event'][number];
export type TeamInfo = NonNullable<GetTeamQueryResult['data']>['team'][number];
export type TeamManageInfo = NonNullable<GetTeamManageQueryResult['data']>['team'][number];
export type ProjectInfo = NonNullable<GetProjectQueryResult['data']>['project'][number];
export type ProjectManageInfo = NonNullable<GetProjectManageQueryResult['data']>['project'][number];
