import type { Individual } from '../individual.entity';
import type { Session } from '../session/session.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { UserInfoProps } from '@okampus/shared/dtos';
import type { Shortcut } from '../shortcut/shortcut.entity';

export type UserInfoOptions = UserInfoProps &
  TenantScopedOptions & {
    individual: Individual;
    shortcuts?: Shortcut[];
    session?: Session[];
  };
