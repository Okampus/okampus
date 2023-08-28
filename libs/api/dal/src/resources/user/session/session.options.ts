import type { User } from '../user.entity';
import type { SessionProps } from './session.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type SessionOptions = SessionProps &
  TenantScopedOptions & {
    user: User;
    tokenFamily: string;
    refreshTokenHash: string;
    lastIssuedAt?: Date;
  };
