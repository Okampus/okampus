import { registerEnumType } from '@nestjs/graphql';

export enum MetricName {
  ClubCount = 'clubCount',
  ClubMembershipCount = 'clubMembershipCount',
  ClubUniqueMembershipCount = 'clubUniqueMembershipCount',
  ClubEventCount = 'clubEventCount',
  ClubCreatedEventCount = 'clubCreatedEventCount',

  UserCount = 'userCount',
}

registerEnumType(MetricName, { name: 'MetricName' });
