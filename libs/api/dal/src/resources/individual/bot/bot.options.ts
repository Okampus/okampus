import type { Actor } from '../../actor/actor.entity';
import type { BotProps } from '@okampus/shared/dtos';
import type { Individual } from '../individual.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type BotOptions = BotProps &
  TenantScopedOptions & {
    individual: Individual;
    owner: Actor;
  };
