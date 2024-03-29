export enum EntityNames {
  Actor = 'Actor',
  ActorImage = 'ActorImage',
  ActorTag = 'ActorTag',
  Address = 'Address',
  BankAccountInfo = 'BankAccountInfo',
  LegalUnit = 'LegalUnit',
  LegalUnitLocation = 'LegalUnitLocation',
  Social = 'Social',
  Transaction = 'Transaction',

  Event = 'Event',
  Favorite = 'Favorite',
  EventJoin = 'EventJoin',
  EventOrganize = 'EventOrganize',
  EventSupervisor = 'EventSupervisor',

  Tenant = 'Tenant',
  TenantLocation = 'TenantLocation',
  TenantLocationCluster = 'TenantLocationCluster',
  EventApproval = 'EventApproval',
  EventApprovalStep = 'EventApprovalStep',
  EventApprovalValidator = 'EventApprovalValidator',
  RequiredDocument = 'RequiredDocument',
  RequiredRole = 'RequiredRole',
  TenantMember = 'TenantMember',
  TenantMemberRole = 'TenantMemberRole',
  TenantRole = 'TenantRole',

  Team = 'Team',
  Action = 'Action',
  BankAccount = 'BankAccount',
  Expense = 'Expense',
  ExpenseItem = 'ExpenseItem',
  Grant = 'Grant',
  GrantAllocate = 'GrantAllocate',
  Mission = 'Mission',
  MissionJoin = 'MissionJoin',
  Project = 'Project',
  ProjectSupervisor = 'ProjectSupervisor',
  TeamDocument = 'TeamDocument',
  TeamHistory = 'TeamHistory',
  TeamJoin = 'TeamJoin',
  TeamMember = 'TeamMember',
  TeamMemberRole = 'TeamMemberRole',
  TeamRequiredRole = 'TeamRequiredRole',
  TeamRole = 'TeamRole',

  Form = 'Form',
  FormSubmission = 'FormSubmission',

  User = 'User',
  Follow = 'Follow',
  Session = 'Session',

  FileUpload = 'FileUpload',
  Location = 'Location',
  Tag = 'Tag',
}

// TODO: add test to match all *.entity.ts files with this list (all entities except Log)
