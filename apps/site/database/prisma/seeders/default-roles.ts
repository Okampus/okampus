import { Colors, TeamRoleType, TenantRoleType } from '@okampus/shared/enums';

export const DEFAULT_TEAM_ROLES = [
  {
    name: 'Membre',
    color: Colors.Blue,
    canViewJoins: true,
  },
  {
    name: 'President',
    color: Colors.Green,
    canManageProfile: true,
    canViewTreasury: true,
    canManageTreasury: true,
    canViewJoins: true,
    canManageJoins: true,
    canManageDocuments: true,
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
    canManageDocuments: true,
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
    canManageDocuments: true,
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
    name: 'Cohésion',
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

export const DEFAULT_TENANT_ROLES = [
  {
    name: 'Okampus',
    type: TenantRoleType.Okampus,
    color: Colors.Green,
    canViewHidden: true,
    canHide: true,
    canCreateTeam: true,
    canManageCampus: true,
    canManageEventApprovalSteps: true,
    canManageEventApprovals: true,
    canManageTenant: true,
  },

  {
    name: 'Administration',
    type: TenantRoleType.Administration,
    color: Colors.Red,
    canViewHidden: true,
    canHide: true,
    canCreateTeam: true,
    canManageCampus: true,
    canManageEventApprovalSteps: true,
    canManageEventApprovals: true,
    canManageTenant: true,
  },
  { name: 'Étudiant', type: TenantRoleType.Student, color: Colors.Blue },
  { name: 'Professeur', type: TenantRoleType.Teacher, color: Colors.LightOrange },
];