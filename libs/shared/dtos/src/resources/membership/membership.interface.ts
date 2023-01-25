import { MembershipKind } from '@okampus/shared/enums';
import { IUser } from '../actor/user/user.interface';
import { ITenantScopedEntity } from '../tenant-scoped.interface';
import { MembershipProps } from './membership.props';

export type IMembership = ITenantScopedEntity &
  MembershipProps & {
    membershipKind: MembershipKind;
    user?: IUser;
    endDate: Date | null;
  };
