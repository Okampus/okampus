import type { BankAccount } from './bank-account.entity';
import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { BankInfo } from '../../actor/bank-info/bank-info.entity';
import type { BankAccountProps } from './bank-account.props';

export type BankAccountOptions = BankAccountProps &
  TenantScopedOptions & {
    bankInfo?: BankInfo | null;
    team: Team;
    parent?: BankAccount | null;
  };
