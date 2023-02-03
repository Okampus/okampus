import { BotProps } from '@okampus/shared/dtos';
import { Actor } from '../actor.entity';
import { IndividualOptions } from '../individual/individual.options';

export type BotOptions = BotProps &
  IndividualOptions & {
    owner: Actor;
  };
