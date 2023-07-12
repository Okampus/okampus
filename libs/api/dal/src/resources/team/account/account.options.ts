import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { BankInfo } from '../../actor/bank-info/bank-info.entity';
import type { AccountProps } from '@okampus/shared/dtos';

export type AccountOptions = AccountProps &
  TenantScopedOptions & {
    bankInfo: BankInfo;
    team: Team;
  };
