import { RoleProps, TeamRoleProps } from '@okampus/shared/dtos';
import { Colors, TeamPermissions, TeamRoleCategory, TeamRoleKey } from '@okampus/shared/enums';

type TeamRoleDefault = TeamRoleProps &
  RoleProps & {
    key?: TeamRoleKey;
    required?: boolean;
  };

const viewPermissions = [TeamPermissions.ViewDraftEvents, TeamPermissions.ViewRequests, TeamPermissions.ViewTreasury];

export const clubDefaultRoles: TeamRoleDefault[] = [
  {
    name: 'President',
    color: Colors.Green,
    category: TeamRoleCategory.Directors,
    permissions: [TeamPermissions.Admin],
    key: TeamRoleKey.Director,
    required: true,
  },
  {
    name: 'Trésorier',
    color: Colors.Green,
    category: TeamRoleCategory.Directors,
    permissions: [TeamPermissions.Admin],
    key: TeamRoleKey.Treasurer,
    required: true,
  },
  {
    name: 'Secrétaire',
    color: Colors.Green,
    category: TeamRoleCategory.Directors,
    permissions: [TeamPermissions.Admin],
    key: TeamRoleKey.Secretary,
    required: true,
  },
  {
    name: 'Responsable événements',
    color: Colors.Red,
    category: TeamRoleCategory.Managers,
    permissions: [...viewPermissions, TeamPermissions.ManageEvents],
    required: true,
  },
  {
    name: 'Responsable adhésions',
    color: Colors.Red,
    category: TeamRoleCategory.Managers,
    permissions: [
      ...viewPermissions,
      TeamPermissions.ManageRequests,
      TeamPermissions.ManageMembers,
      TeamPermissions.ManageRoles,
    ],
  },
  {
    name: 'Membre',
    color: Colors.Blue,
    category: TeamRoleCategory.Members,
    permissions: [TeamPermissions.ViewTreasury],
  },
];

export const teamDefaultRoles = [
  {
    name: 'Propriétaire',
    color: Colors.Green,
    category: TeamRoleCategory.Directors,
    permissions: [TeamPermissions.Admin],
    key: TeamRoleKey.Director,
    required: true,
  },
];
