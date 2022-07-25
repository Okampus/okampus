import { registerEnumType } from '@nestjs/graphql';

export enum MembershipRequestIssuer {
  Team = 'team',
  User = 'user',
}

registerEnumType(MembershipRequestIssuer, { name: 'MembershipRequestIssuer' });
