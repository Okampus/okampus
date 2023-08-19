'use client';

import { meSlugAtom } from './global';
import { useTypedFragment } from '../hooks/apollo/useTypedFragment';
import { getFragmentFromQuery } from '../utils/apollo/get-from-query';
import { getTenantFromHost } from '../utils/headers/get-tenant-from-host';
import {
  GetEventDocument,
  GetEventManageDocument,
  GetTeamDocument,
  GetTeamManageDocument,
  GetUserDocument,
  GetTenantManageDocument,
  GetProjectDocument,
  GetProjectManageDocument,
  GetMeDocument,
} from '@okampus/shared/graphql';

import { useAtom } from 'jotai';
import { redirect } from 'next/navigation';

import type {
  GetEventQueryResult,
  GetEventManageQueryResult,
  GetTeamQueryResult,
  GetTeamManageQueryResult,
  GetUserQueryResult,
  GetTenantManageQueryResult,
  GetProjectQueryResult,
  GetProjectManageQueryResult,
  GetMeQueryResult,
} from '@okampus/shared/graphql';

const UserFragment = getFragmentFromQuery('User', GetUserDocument);
const UserLoginFragment = getFragmentFromQuery('UserLogin', GetMeDocument);
const TenantManageFragment = getFragmentFromQuery('Tenant', GetTenantManageDocument, 'TenantManage');
const EventFragment = getFragmentFromQuery('Event', GetEventDocument);
const EventManageFragment = getFragmentFromQuery('Event', GetEventManageDocument, 'EventManage');
const TeamFragment = getFragmentFromQuery('Team', GetTeamDocument);
const TeamManageFragment = getFragmentFromQuery('Team', GetTeamManageDocument, 'TeamManage');
const ProjectFragment = getFragmentFromQuery('Project', GetProjectDocument);
const ProjectManageFragment = getFragmentFromQuery('Project', GetProjectManageDocument, 'ProjectManage');

export type UserInfo = NonNullable<GetUserQueryResult['data']>['user'][number];
export type UserMeInfo = NonNullable<GetMeQueryResult['data']>['me'];
export type TenantInfo = NonNullable<GetMeQueryResult['data']>['me']['user']['tenant'];
export type TenantManageInfo = NonNullable<GetTenantManageQueryResult['data']>['tenant'][number];
export type EventInfo = NonNullable<GetEventQueryResult['data']>['event'][number];
export type EventManageInfo = NonNullable<GetEventManageQueryResult['data']>['event'][number];
export type TeamInfo = NonNullable<GetTeamQueryResult['data']>['team'][number];
export type TeamManageInfo = NonNullable<GetTeamManageQueryResult['data']>['team'][number];
export type ProjectInfo = NonNullable<GetProjectQueryResult['data']>['project'][number];
export type ProjectManageInfo = NonNullable<GetProjectManageQueryResult['data']>['project'][number];

export function useUser(slug: string) {
  const where = { individual: { actor: { slug } } };
  const user = useTypedFragment<UserInfo>({ __typename: 'User', fragment: UserFragment, where });
  return { user };
}

export function useMeSlug() {
  const [slug] = useAtom(meSlugAtom);
  if (!slug) redirect('/signin');

  return slug;
}

export function useMe() {
  const slug = useMeSlug();
  const where = { user: { individual: { actor: { slug } } } };
  const me = useTypedFragment<UserMeInfo>({ __typename: 'UserLogin', fragment: UserLoginFragment, where });
  if (!me) redirect('/signin');

  return me;
}

export function useTenant() {
  const me = useMe();
  const canManage =
    me.canManageTenant ?? me.user.teamMembers.some(({ team }) => team.id === me.user.tenant?.adminTeam?.id);
  return { tenant: me.user.tenant, canManage };
}

export function useTenantManage() {
  const tenantManage = useTypedFragment<TenantManageInfo>({
    __typename: 'Tenant',
    fragmentTypename: 'TenantManage',
    fragment: TenantManageFragment,
    where: { domain: getTenantFromHost(window.location.host) },
  });
  return { tenantManage };
}

export function useEvent(slug: string) {
  const me = useMe();
  const event = useTypedFragment<EventInfo>({ __typename: 'Event', fragment: EventFragment, where: { slug } });

  if (!event) return { event: null, canManage: false };

  const canManage = me
    ? me.canManageTenant ??
      event.eventOrganizes.some(({ eventSupervisors }) => eventSupervisors.some(({ user }) => user.id === me.user.id))
    : false;

  return { event, canManage };
}

export function useEventManage(slug: string) {
  const eventManage = useTypedFragment<EventManageInfo>({
    __typename: 'Event',
    fragmentTypename: 'EventManage',
    fragment: EventManageFragment,
    where: { slug },
  });
  return { eventManage };
}

export function useTeam(slug: string) {
  const me = useMe();

  const where = { actor: { slug } };
  const team = useTypedFragment<TeamInfo>({ __typename: 'Team', fragment: TeamFragment, where });
  if (!team) return { team: null, canManage: false };

  const canManage = me
    ? me.canManageTenant || me.user.teamMembers.some((teamMember) => teamMember.team.id === team.id)
    : false;

  return { team, canManage };
}

export function useTeamManage(slug: string) {
  const teamManage = useTypedFragment<TeamManageInfo>({
    __typename: 'Team',
    fragmentTypename: 'TeamManage',
    fragment: TeamManageFragment,
    where: { actor: { slug } },
  });
  return { teamManage };
}

export function useProject(slug: string) {
  const me = useMe();
  const project = useTypedFragment<ProjectInfo>({ __typename: 'Project', fragment: ProjectFragment, where: { slug } });

  if (!project) return { project: null, canManage: false };

  const canManage = me
    ? me.canManageTenant || me.user.teamMembers.some((teamMember) => teamMember.team.id === project.team.id)
    : false;

  return { project, canManage };
}

export function useProjectManage(slug: string) {
  const project = useTypedFragment<ProjectManageInfo>({
    __typename: 'Project',
    fragmentTypename: 'ProjectManage',
    fragment: ProjectManageFragment,
    where: { slug },
  });

  return { project };
}
