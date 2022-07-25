import { registerEnumType } from '@nestjs/graphql';

export enum MembershipRequestState {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

registerEnumType(MembershipRequestState, { name: 'MembershipRequestState' });
