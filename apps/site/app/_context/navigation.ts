'use client';

import { meSlugAtom } from './global';
import { useTypedFragment } from '../_hooks/apollo/useTypedFragment';

import {
  EventFragment,
  EventManageFragment,
  ProjectFragment,
  ProjectManageFragment,
  TeamFragment,
  TeamManageFragment,
  TenantManageFragment,
  UserFragment,
  MeFragment,
} from '../../utils/apollo/fragments';
import { getTenantFromHost } from '../../utils/host/get-tenant-from-host';

import { useAtom } from 'jotai';
import { redirect } from 'next/navigation';

import type {
  EventInfo,
  EventManageInfo,
  ProjectInfo,
  ProjectManageInfo,
  TeamInfo,
  TeamManageInfo,
  TenantManageInfo,
  UserInfo,
  MeInfo,
} from '../../utils/apollo/fragments';

export function useUser(slug: string) {
  const user = useTypedFragment<UserInfo>({ __typename: 'User', fragment: UserFragment, where: { slug } });
  return { user };
}

export function useMeSlug() {
  const [slug] = useAtom(meSlugAtom);
  if (!slug) redirect('/signin');

  return slug;
}

export function useMe() {
  const slug = useMeSlug();
  const me = useTypedFragment<MeInfo>({
    __typename: 'User',
    fragment: MeFragment,
    fragmentTypename: 'Me',
    where: { slug },
  });

  if (!me) redirect('/signin');

  return me;
}

export function useTenant() {
  const me = useMe();

  const canManage = me.tenantMemberships.some(
    ({ tenantMemberRoles, tenantScopeId }) =>
      tenantScopeId === me.originalTenantScope.id &&
      tenantMemberRoles.some(({ tenantRole }) => tenantRole.canManageTenant),
  );

  return { tenant: me.originalTenantScope, canManage };
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
    ? event.eventOrganizes.some(({ eventSupervisors }) => eventSupervisors.some(({ user }) => user.id === me.id))
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

  const where = { slug };
  const team = useTypedFragment<TeamInfo>({ __typename: 'Team', fragment: TeamFragment, where });
  if (!team) return { team: null, canManage: false };

  const canManage = me ? me.teamMemberships.some((teamMember) => teamMember.team.id === team.id) : false;

  return { team, canManage };
}

export function useTeamManage(slug: string) {
  const teamManage = useTypedFragment<TeamManageInfo>({
    __typename: 'Team',
    fragmentTypename: 'TeamManage',
    fragment: TeamManageFragment,
    where: { slug },
  });
  return { teamManage };
}

export function useProject(slug: string) {
  const me = useMe();
  const project = useTypedFragment<ProjectInfo>({ __typename: 'Project', fragment: ProjectFragment, where: { slug } });

  if (!project) return { project: null, canManage: false };

  const canManage = me ? me.teamMemberships.some((teamMember) => teamMember.team.id === project.team.id) : false;

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
