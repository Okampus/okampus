import type { SessionProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { User } from '../../actor/user/user.entity';

export type SessionOptions = SessionProps &
  TenantScopedOptions & {
    user: User;
    tokenFamily: string;
    refreshTokenHash: string;
    lastIssuedAt?: Date;
  };
