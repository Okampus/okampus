import type { Account } from './account.entity';
import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { BankInfo } from '../../actor/bank-info/bank-info.entity';
import type { AccountProps } from './account.props';

export type AccountOptions = AccountProps &
  TenantScopedOptions & {
    bankInfo?: BankInfo | null;
    team: Team;
    parent?: Account | null;
  };
