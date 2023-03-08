import { ANON_ACCOUNT_SLUG } from '@okampus/shared/consts';
import { isNotNull, isNotEmpty } from '@okampus/shared/utils';

import type { TeamRoleFilterQuery } from './users/team-role.filter-query';
import type { TeamFilterQuery } from '../resources/teams/team.filter-query';
import type { FilterQuery } from '@mikro-orm/core';
import type { Team, TeamRole, User } from '@okampus/api/dal';
import type { UserFilterQuery } from './users/user.filter-query';
import type { Snowflake } from '@okampus/shared/types';

export function teamFilterQuery(filterQuery: TeamFilterQuery, tenantId: Snowflake): FilterQuery<Team> {
  return {
    tenant: { id: tenantId },
    ...(isNotEmpty(filterQuery.ids) && { id: { $in: filterQuery.ids } }),
    ...(isNotEmpty(filterQuery.slugs) && { actor: { slug: { $in: filterQuery.slugs } } }),
    ...(isNotEmpty(filterQuery.categories) && { categories: { slug: { $in: filterQuery.categories } } }),
    ...(isNotEmpty(filterQuery.types) && { type: { $in: filterQuery.types } }),
  };
}

export function teamRoleFilterQuery(filterQuery: TeamRoleFilterQuery, tenantId: Snowflake): FilterQuery<TeamRole> {
  const includesPermissions = isNotEmpty(filterQuery.permissionsSome) || isNotEmpty(filterQuery.permissionsAll);

  return {
    tenant: { id: tenantId },
    ...(isNotEmpty(filterQuery.ids) && { id: { $in: filterQuery.ids } }),
    ...(isNotNull(filterQuery.teams) && { team: teamFilterQuery(filterQuery.teams, tenantId) }),
    ...(includesPermissions && {
      permissions: {
        ...(isNotEmpty(filterQuery.permissionsAll) && { $and: filterQuery.permissionsAll }),
        ...(isNotEmpty(filterQuery.permissionsSome) && { $or: filterQuery.permissionsSome }),
      },
    }),
    ...(isNotEmpty(filterQuery.categories) && { category: { $in: filterQuery.categories } }),
    ...(isNotEmpty(filterQuery.keys) && { key: { $in: filterQuery.keys } }),
  };
}

export function userFilterQuery(filterQuery: UserFilterQuery, tenantId: Snowflake): FilterQuery<User> {
  const includesTeamMemberships = isNotNull(filterQuery.teamMemberships) || isNotNull(filterQuery.teamRoles);

  return {
    tenant: { id: tenantId },
    ...(isNotEmpty(filterQuery.ids) && { id: { $in: filterQuery.ids } }),
    ...(isNotEmpty(filterQuery.slugs)
      ? { actor: { slug: { $in: filterQuery.slugs, $ne: ANON_ACCOUNT_SLUG } } }
      : { actor: { slug: { $ne: ANON_ACCOUNT_SLUG } } }),
    ...(isNotEmpty(filterQuery.scopeRoles) && { scopeRole: { $in: filterQuery.scopeRoles } }),
    ...(includesTeamMemberships && {
      teamMemberships: {
        ...(isNotNull(filterQuery.teamMemberships) && { team: teamFilterQuery(filterQuery.teamMemberships, tenantId) }),
        ...(isNotNull(filterQuery.teamRoles) && { role: teamRoleFilterQuery(filterQuery.teamRoles, tenantId) }),
      },
    }),
  };
}
