import type { Actor } from '../actor.entity';
import type { ActorBankInfoProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type ActorBankInfoOptions = ActorBankInfoProps &
  TenantScopedOptions & {
    actor: Actor;
  };
