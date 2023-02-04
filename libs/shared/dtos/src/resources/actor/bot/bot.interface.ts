import type { IActor } from '../actor.interface';
import type { IIndividual } from '../individual/individual.interface';
import type { BotProps } from './bot.props';

export type IBot = IIndividual &
  BotProps & {
    owner?: IActor;
  };
