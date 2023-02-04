import type { MembershipKind } from '@okampus/shared/enums';
import type { IUser } from '../actor/user/user.interface';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { MembershipProps } from './membership.props';

export type IMembership = ITenantScoped &
  MembershipProps & {
    membershipKind: MembershipKind;
    user?: IUser;
    endDate: Date | null;
  };
