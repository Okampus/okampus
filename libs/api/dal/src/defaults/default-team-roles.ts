import { Colors, TeamPermissions, RoleCategory, TeamRoleType } from '@okampus/shared/enums';
import type { RoleOptions } from '../resources/team/role/role.options';

const viewPermissions = [TeamPermissions.ViewDraftEvents, TeamPermissions.ViewJoins, TeamPermissions.ViewTreasury];

export const clubDefaultRoles: Omit<RoleOptions, 'team' | 'tenant' | 'createdBy'>[] = [
  {
    name: 'President',
    color: Colors.Green,
    category: RoleCategory.Directors,
    permissions: 0,
    type: TeamRoleType.Director,
    isRequired: true,
  },
  {
    name: 'Trésorier',
    color: Colors.Green,
    category: RoleCategory.Directors,
    permissions: 0,
    type: TeamRoleType.Treasurer,
    isRequired: true,
  },
  {
    name: 'Secrétaire',
    color: Colors.Green,
    category: RoleCategory.Directors,
    permissions: 0,
    type: TeamRoleType.Secretary,
    isRequired: true,
  },
  {
    name: 'Responsable événements',
    color: Colors.Red,
    category: RoleCategory.Managers,
    permissions: 0,
    isRequired: true,
  },
  {
    name: 'Responsable adhésions',
    color: Colors.Red,
    category: RoleCategory.Managers,
    permissions: 0,
  },
  {
    name: 'Membre',
    color: Colors.LightBlue,
    category: RoleCategory.Members,
    permissions: 0,
  },
];

export const teamDefaultRoles = [
  {
    name: 'Propriétaire',
    color: Colors.Green,
    category: RoleCategory.Directors,
    permissions: 0,
    key: TeamRoleType.Director,
    required: true,
  },
];
