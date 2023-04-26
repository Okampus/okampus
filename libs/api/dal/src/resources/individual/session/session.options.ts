import type { UserInfo } from '../user-info/user-info.entity';
import type { SessionProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type SessionOptions = SessionProps &
  TenantScopedOptions & {
    user: UserInfo;
    tokenFamily: string;
    refreshTokenHash: string;
    lastIssuedAt?: Date;
  };
