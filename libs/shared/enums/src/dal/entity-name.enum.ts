export enum EntityName {
  User = 'User',

  Tenant = 'Tenant',
  TenantMember = 'TenantMember',
  TenantMemberRole = 'TenantMemberRole',
  TenantRole = 'TenantRole',
  TenantOrganize = 'TenantOrganize',
  Campus = 'Campus',
  CampusCluster = 'CampusCluster',

  Actor = 'Actor',
  ActorImage = 'ActorImage',
  ActorTag = 'ActorTag',
  Address = 'Address',
  BankInfo = 'BankInfo',
  Finance = 'Finance',
  Location = 'Location',
  LegalUnit = 'LegalUnit',
  LegalUnitLocation = 'LegalUnitLocation',

  Social = 'Social',
  Tag = 'Tag',
  Follow = 'Follow',

  Session = 'Session',
  Shortcut = 'Shortcut',

  Team = 'Team',
  TeamDocument = 'TeamDocument',
  TeamHistory = 'TeamHistory',
  TeamJoin = 'TeamJoin',
  TeamMember = 'TeamMember',
  TeamMemberRole = 'TeamMemberRole',
  TeamRole = 'TeamRole',
  Action = 'Action',
  Mission = 'Mission',
  MissionJoin = 'MissionJoin',
  Pole = 'Pole',

  BankAccount = 'BankAccount',
  Expense = 'Expense',
  ExpenseItem = 'ExpenseItem',

  Grant = 'Grant',
  GrantAllocate = 'GrantAllocate',

  Project = 'Project',

  Event = 'Event',
  EventApproval = 'EventApproval',
  EventApprovalStep = 'EventApprovalStep',
  EventFavorite = 'EventFavorite',
  EventJoin = 'EventJoin',
  EventOrganize = 'EventOrganize',
  EventSupervisor = 'EventSupervisor',

  FileUpload = 'FileUpload',

  Form = 'Form',
  FormSubmission = 'FormSubmission',
}

// TODO: add test to match all *.entity.ts files with this list (all entities except Log)
