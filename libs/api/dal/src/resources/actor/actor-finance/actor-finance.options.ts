import type { Upload } from '../../upload/upload';
import type { Actor } from '../actor.entity';
import type { ActorFinanceProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ActorAddress } from '../actor-address/actor-address.entity';

export type ActorFinanceOptions = ActorFinanceProps &
  TenantScopedOptions & {
    payedBy?: Actor;
    location: ActorAddress;
    receipts?: Upload[];
  };
