import { Colors, TeamRoleType } from '@okampus/shared/enums';
import type { TeamRoleOptions } from '../resources/team/team-role/team-role.options';

export const clubDefaultRoles: Omit<TeamRoleOptions, 'team' | 'tenantScope' | 'createdBy'>[] = [
  {
    name: 'President',
    color: Colors.Green,
    canManageProfile: true,
    canViewTreasury: true,
    canManageTreasury: true,
    canViewJoins: true,
    canManageJoins: true,
    canManageMemberRoles: true,
    canManageRoles: true,
    canCreateEvents: true,
    canManageEvents: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    canCreateContents: true,
    canManageContents: true,
    type: TeamRoleType.President,
  },
  {
    name: 'Trésorier',
    color: Colors.Green,
    canManageProfile: true,
    canViewTreasury: true,
    canManageTreasury: true,
    canViewJoins: true,
    canManageJoins: true,
    canManageMemberRoles: true,
    canManageRoles: true,
    canCreateEvents: true,
    canManageEvents: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    canCreateContents: true,
    canManageContents: true,
    type: TeamRoleType.Treasurer,
  },
  {
    name: 'Secrétaire',
    color: Colors.Green,
    canManageProfile: true,
    canViewTreasury: true,
    canManageTreasury: true,
    canViewJoins: true,
    canManageJoins: true,
    canManageMemberRoles: true,
    canManageRoles: true,
    canCreateEvents: true,
    canManageEvents: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    canCreateContents: true,
    canManageContents: true,
    type: TeamRoleType.Secretary,
  },
  {
    name: 'Événements',
    color: Colors.Red,
    isPole: true,
    canViewTreasury: true,
    canViewJoins: true,
    canCreateEvents: true,
    canManageEvents: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
  },
  {
    name: 'Communication',
    color: Colors.Purple,
    isPole: true,
    canManageProfile: true,
    canViewJoins: true,
    canViewDraftEvents: true,
    canCreateContents: true,
    canManageContents: true,
  },
  {
    name: 'Responsable cohésion',
    color: Colors.Orange,
    canViewJoins: true,
    canManageJoins: true,
    canManageMemberRoles: true,
    canManageRoles: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    canCreateContents: true,
    canManageContents: true,
  },
];
