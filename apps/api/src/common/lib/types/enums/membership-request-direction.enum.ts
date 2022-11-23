import { registerEnumType } from '@nestjs/graphql';

export enum MembershipRequestDirection {
  All = 'All',
  Incoming = 'Incoming',
  Outgoing = 'Outgoing',
}

registerEnumType(MembershipRequestDirection, { name: 'MembershipRequestDirection' });
