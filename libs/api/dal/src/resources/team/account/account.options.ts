import type { Account } from './account.entity';
import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Bank } from '../../actor/bank/bank.entity';
import type { AccountProps } from './account.props';

export type AccountOptions = AccountProps &
  TenantScopedOptions & {
    bank?: Bank | null;
    team: Team;
    parent?: Account | null;
  };
