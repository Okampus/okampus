import type { BotProps } from '@okampus/shared/dtos';
import type { Actor } from '../actor.entity';
import type { IndividualOptions } from '../individual/individual.options';

export type BotOptions = BotProps &
  IndividualOptions & {
    owner: Actor;
  };
