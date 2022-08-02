import { registerEnumType } from '@nestjs/graphql';

export enum MetricName {
  ClubCount = 'ClubCount',
  ClubMembershipCount = 'ClubMembershipCount',
  ClubUniqueMembershipCount = 'ClubUniqueMembershipCount',
  ClubEventCount = 'ClubEventCount',
  ClubCreatedEventCount = 'ClubCreatedEventCount',

  UserCount = 'UserCount',
}

registerEnumType(MetricName, { name: 'MetricName' });
