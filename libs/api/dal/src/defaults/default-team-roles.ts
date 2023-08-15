import { Colors, TeamPermissions, RoleCategory, TeamRoleType } from '@okampus/shared/enums';
import type { RoleOptions } from '../resources/team/role/role.options';

const viewPermissions = [TeamPermissions.ViewDraftEvents, TeamPermissions.ViewJoins];
const manageMembersPermissions = [
  TeamPermissions.ManageJoins,
  TeamPermissions.ManageMembers,
  TeamPermissions.ManageRoles,
  TeamPermissions.CreateActions,
  TeamPermissions.ManageActions,
];
const manageCommunicationPermissions = [
  TeamPermissions.ManageProfile,
  TeamPermissions.ManageContents,
  TeamPermissions.CreateContents,
];
const manageEventPermissions = [
  TeamPermissions.CreateEvents,
  TeamPermissions.ManageEvents,
  TeamPermissions.CreateActions,
  TeamPermissions.ManageActions,
];

const manageTreasuryPermissions = [TeamPermissions.ViewTreasury, TeamPermissions.ManageTreasury];

export const clubDefaultRoles: Omit<RoleOptions, 'team' | 'tenant' | 'createdBy'>[] = [
  {
    name: 'President',
    color: Colors.Green,
    category: RoleCategory.Directors,
    permissions: [
      ...viewPermissions,
      ...manageMembersPermissions,
      ...manageEventPermissions,
      ...manageCommunicationPermissions,
      ...manageTreasuryPermissions,
    ],
    type: TeamRoleType.Director,
    isLocked: true,
  },
  {
    name: 'Trésorier',
    color: Colors.Green,
    category: RoleCategory.Directors,
    permissions: [
      ...viewPermissions,
      ...manageMembersPermissions,
      ...manageEventPermissions,
      ...manageCommunicationPermissions,
      ...manageTreasuryPermissions,
    ],
    type: TeamRoleType.Treasurer,
    isLocked: true,
  },
  {
    name: 'Secrétaire',
    color: Colors.Green,
    category: RoleCategory.Directors,
    permissions: [
      ...viewPermissions,
      ...manageMembersPermissions,
      ...manageEventPermissions,
      ...manageCommunicationPermissions,
      TeamPermissions.ViewTreasury,
    ],
    type: TeamRoleType.Secretary,
    isLocked: true,
  },
  {
    name: 'Responsable événements',
    color: Colors.Red,
    category: RoleCategory.Managers,
    permissions: [...viewPermissions, ...manageEventPermissions],
    isLocked: true,
  },
  {
    name: 'Responsable communication',
    color: Colors.Red,
    category: RoleCategory.Managers,
    permissions: [...viewPermissions, ...manageCommunicationPermissions],
  },
  {
    name: 'Responsable cohésion',
    color: Colors.Red,
    category: RoleCategory.Managers,
    permissions: [...viewPermissions, ...manageMembersPermissions],
  },
  {
    name: 'Membre',
    color: Colors.LightBlue,
    category: RoleCategory.Members,
    permissions: viewPermissions,
  },
];

export const teamDefaultRoles = [
  {
    name: 'Propriétaire',
    color: Colors.Green,
    category: RoleCategory.Directors,
    key: TeamRoleType.Director,
    permissions: [
      ...viewPermissions,
      ...manageMembersPermissions,
      ...manageEventPermissions,
      ...manageCommunicationPermissions,
      ...manageTreasuryPermissions,
    ],
    required: true,
  },
];
