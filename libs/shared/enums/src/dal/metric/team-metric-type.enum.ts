// IOACO = InOrgAndChildOrg
// IOO = InOrgOnly
export enum TeamMetricType {
  MemberIOACOCount = 'MemberInOrgAndChildrenCount',
  MemberIOACOUniqueCount = 'MemberInOrgAndChildrenUniqueCount', // Members can be part of org and in multiple child orgs at the same time
  // MemberIOOCount = 'MemberInOrgAndChildrenUniqueCount',

  EventOccuringIOACOCount = 'EventOccuringCount',
  EventCreatedIOACOCount = 'EventCreatedCount',
  // EventOccuringIOOCount = 'EventOccuringCount',
  // EventCreatedIOOount = 'EventCreatedCount',

  ProjectOccuringIOACOCount = 'ProjectCreatedCount',
  // ProjectCreatedIOACOCount = 'ProjectCreatedCount',
  // ProjectOccuringIOOCount = 'ProjectCreatedCount',
  // ProjectCreatedIOOCount = 'ProjectCreatedCount',

  ContentCreatedIOACOCount = 'ContentCreatedCount',
  // ContentCreatedIOOCount = 'ContentCreatedCount',

  ChildOrgCount = 'ChildOrgCount',
}
