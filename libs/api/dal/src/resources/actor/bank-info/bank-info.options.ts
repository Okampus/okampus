import type { Actor } from '../actor.entity';
import type { BankInfoProps } from './bank-info.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { Address } from '../address/address.entity';
import type { LegalUnit } from '../legal-unit/legal-unit.entity';

export type BankInfoOptions = BankInfoProps &
  TenantScopedOptions & {
    actor: Actor;
    bank: LegalUnit;
    branchAddress: Address;
  };
