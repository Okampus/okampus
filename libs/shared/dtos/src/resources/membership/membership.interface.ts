import { MembershipKind } from '@okampus/shared/enums';
import { IUser } from '../actor/user/user.interface';
import { ITenantScoped } from '../tenant-scoped.interface';
import { MembershipProps } from './membership.props';

export type IMembership = ITenantScoped &
  MembershipProps & {
    membershipKind: MembershipKind;
    user?: IUser;
    endDate: Date | null;
  };
