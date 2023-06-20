import type { User } from '../user/user.entity';
import type { SessionProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type SessionOptions = SessionProps &
  TenantScopedOptions & {
    user: User;
    tokenFamily: string;
    refreshTokenHash: string;
    lastIssuedAt?: Date;
  };
