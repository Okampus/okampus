import type { Actor } from '../actor.entity';
import type { BankInfoProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Address } from '../address/address.entity';

export type BankInfoOptions = BankInfoProps &
  TenantScopedOptions & {
    actor: Actor;
    address: Address;
  };
