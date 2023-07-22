import { meSlugAtom } from './global';
import { useTypedFragment } from '../hooks/apollo/useTypedFragment';
import {
  projectBaseInfo,
  userBaseInfo,
  teamManageInfo,
  eventManageInfo,
  tenantManageInfo,
  eventDetailsInfo,
  userLoginInfo,
  teamWithMembersInfo,
} from '@okampus/shared/graphql';

import { useAtom } from 'jotai';

import type {
  EventManageInfo,
  TeamManageInfo,
  ProjectBaseInfo,
  UserBaseInfo,
  TenantManageInfo,
  EventDetailsInfo,
  UserLoginInfo,
  TeamWithMembersInfo,
} from '@okampus/shared/graphql';

export function useMe() {
  const [slug] = useAtom(meSlugAtom);
  const where = { user: { individual: { actor: { slug: slug ?? '' } } } };
  return useTypedFragment<UserLoginInfo>({ __typename: 'UserLogin', selector: userLoginInfo, where });
}

export function useEvent(slug: string) {
  const me = useMe();
  const selector = eventDetailsInfo;
  const event = useTypedFragment<EventDetailsInfo>({ __typename: 'Event', selector, where: { slug } });
  if (!event) return { event: null, canManage: false };

  const canManage = me
    ? me.canManageTenant ??
      event.eventOrganizes.some(({ supervisors }) =>
        supervisors.some(({ teamMember: { user } }) => user.id === me.user.id)
      )
    : false;

  return { event, canManage };
}

export function useTenant() {
  const me = useMe();
  if (!me) return { tenant: null, canManage: false };

  const tenant = me.user.tenant;
  const adminTeam = tenant.adminTeam;
  const canManage = me.canManageTenant || me.user.teamMembers.some(({ team }) => team.id === adminTeam?.id);
  return { tenant, canManage };
}

export function useEventManage(slug: string) {
  const selector = eventManageInfo;
  const eventManage = useTypedFragment<EventManageInfo>({ __typename: 'Event', selector, where: { slug } });
  return { eventManage };
}

export function useTeam(slug: string) {
  const me = useMe();
  const selector = teamWithMembersInfo;
  const team = useTypedFragment<TeamWithMembersInfo>({ __typename: 'Team', selector, where: { actor: { slug } } });
  if (!team) return { team: null, canManage: false };

  const canManage = me
    ? me.canManageTenant || me.user.teamMembers.some((teamMember) => teamMember.team.id === team.id)
    : false;

  return { team, canManage };
}

export function useTeamManage(slug: string) {
  const selector = teamManageInfo;
  const teamManage = useTypedFragment<TeamManageInfo>({ __typename: 'Team', selector, where: { actor: { slug } } });
  return { teamManage };
}

export function useProject(slug: string) {
  const selector = projectBaseInfo;
  const project = useTypedFragment<ProjectBaseInfo>({ __typename: 'Project', selector, where: { slug } });
  return { project };
}

export function useUser(slug: string) {
  const selector = userBaseInfo;
  const user = useTypedFragment<UserBaseInfo>({ __typename: 'User', selector, where: { actor: { slug } } });
  return { user };
}

export function useTenantManage(slug: string) {
  const where = { adminTeam: { actor: { slug } } };
  const tenantManage = useTypedFragment<TenantManageInfo>({ __typename: 'Tenant', selector: tenantManageInfo, where });
  return { tenantManage };
}
