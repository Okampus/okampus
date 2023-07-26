import type { Individual } from '../individual.entity';
import type { Session } from '../session/session.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { UserProps } from './user.props';
import type { Shortcut } from '../shortcut/shortcut.entity';

export type UserOptions = UserProps &
  TenantScopedOptions & {
    individual: Individual;
    shortcuts?: Shortcut[];
    session?: Session[];
  };
