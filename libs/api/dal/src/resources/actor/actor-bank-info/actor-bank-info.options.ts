import type { Actor } from '../actor.entity';
import type { ActorBankInfoProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ActorAddress } from '../actor-address/actor-address.entity';

export type ActorBankInfoOptions = ActorBankInfoProps &
  TenantScopedOptions & {
    actor: Actor;
    address: ActorAddress;
  };
