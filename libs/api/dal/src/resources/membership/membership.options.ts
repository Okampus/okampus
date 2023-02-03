import { MembershipProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { User } from '../actor/user/user.entity';

export type MembershipOptions = MembershipProps &
  TenantScopedOptions & {
    user: User;
  };
