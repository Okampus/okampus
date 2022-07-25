import { registerEnumType } from '@nestjs/graphql';

export enum MembershipRequestDirection {
  All = 'all',
  Incoming = 'incoming',
  Outgoing = 'outgoing',
}

registerEnumType(MembershipRequestDirection, { name: 'MembershipRequestDirection' });
