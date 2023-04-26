import type { Actor } from '../../actor/actor.entity';
import type { BotInfoProps } from '@okampus/shared/dtos';
import type { Individual } from '../individual.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type BotInfoOptions = BotInfoProps &
  TenantScopedOptions & {
    individual: Individual;
    owner: Actor;
  };
