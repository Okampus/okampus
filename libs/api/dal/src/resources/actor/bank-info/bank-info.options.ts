import type { Actor } from '../actor.entity';
import type { BankInfoProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Address } from '../address/address.entity';
import type { BankInfo } from './bank-info.entity';

export type BankInfoOptions = BankInfoProps &
  TenantScopedOptions & {
    actor: Actor;
    address: Address;
    bank?: BankInfo | null;
  };
