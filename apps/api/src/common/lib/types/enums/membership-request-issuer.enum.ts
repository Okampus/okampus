import { registerEnumType } from '@nestjs/graphql';

export enum MembershipRequestIssuer {
  Team = 'Team',
  User = 'User',
}

registerEnumType(MembershipRequestIssuer, { name: 'MembershipRequestIssuer' });
