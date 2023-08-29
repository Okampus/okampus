export enum EntityName {
  User = 'User',

  Tenant = 'Tenant',
  TenantOrganize = 'TenantOrganize',
  Campus = 'Campus',
  CampusCluster = 'CampusCluster',

  Actor = 'Actor',
  BankInfo = 'BankInfo',
  Address = 'Address',
  Location = 'Location',
  ActorImage = 'ActorImage',
  LegalUnit = 'LegalUnit',
  LegalUnitLocation = 'LegalUnitLocation',

  Social = 'Social',
  Tag = 'Tag',
  Follow = 'Follow',

  Session = 'Session',
  Shortcut = 'Shortcut',

  Team = 'Team',
  TeamHistory = 'TeamHistory',
  Action = 'Action',
  Mission = 'Mission',
  MissionJoin = 'MissionJoin',

  Pole = 'Pole',
  Role = 'Role',
  TeamMemberRole = 'TeamMemberRole',

  BankAccount = 'BankAccount',
  BankAccountAllocate = 'BankAccountAllocate',
  Expense = 'Expense',
  ExpenseItem = 'ExpenseItem',

  Finance = 'Finance',
  TeamJoin = 'TeamJoin',
  TeamMember = 'TeamMember',

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

  Document = 'Document',
}

// TODO: add test to match all *.entity.ts files with this list (all entities except Log)
