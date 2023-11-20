import { TeamRoleType } from '@prisma/client';

import type { Colors } from '@prisma/client';
import type { TeamMemberMinimal } from '../../types/prisma/TeamMember/team-member-minimal';

export const teamRoleTypeImportance: TeamRoleType[] = [
  TeamRoleType.DirectorRole,
  TeamRoleType.Treasurer,
  TeamRoleType.Secretary,
  TeamRoleType.President,
];

export enum RoleType {
  Required = 'Required',
  Director = 'Director',
  Managed = 'Managed',
  Manager = 'Manager',
  Member = 'Member',
}

export function getRoles(teamMember: TeamMemberMinimal) {
  const roles: { id: bigint; color: Colors; name: string; type: RoleType }[] = [];

  const directorRoles = teamMember.teamMemberRoles.filter(
    (role) => role.teamRole.type && teamRoleTypeImportance.includes(role.teamRole.type),
  );
  directorRoles.sort(({ teamRole }) => (teamRole.type ? teamRoleTypeImportance.indexOf(teamRole.type) : -1));
  roles.push(...directorRoles.map(({ teamRole }) => ({ ...teamRole, type: RoleType.Director })));

  const managedRoles = teamMember.managedTeamRoles;
  roles.push(
    ...managedRoles.map(({ id, color, name }) => ({ id, color, name: `Responsable ${name}`, type: RoleType.Managed })),
  );

  const requiredRoles = teamMember.teamRequiredRoles.map((role) => role.requiredRole);
  roles.push(...requiredRoles.map(({ id, color, name }) => ({ id, color, name, type: RoleType.Required })));

  const managerRoles = teamMember.teamMemberRoles.filter((role) => role.teamRole.type === TeamRoleType.ManagerRole);
  roles.push(...managerRoles.map(({ teamRole }) => ({ ...teamRole, type: RoleType.Manager })));

  const memberRoles = teamMember.teamMemberRoles.filter((role) => !role.teamRole.type);
  roles.push(...memberRoles.map(({ teamRole }) => ({ ...teamRole, type: RoleType.Member })));

  return roles;
}
