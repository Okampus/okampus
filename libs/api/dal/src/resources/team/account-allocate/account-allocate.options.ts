import type { Account } from '../account/account.entity';
import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type AccountAllocateOptions = TenantScopedOptions & {
  account: Account;
  team: Team;
};
