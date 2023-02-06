import type { MembershipProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { User } from '../actor/user/user.entity';

export type MembershipOptions = MembershipProps &
  TenantScopedOptions & {
    user: User;
  };
