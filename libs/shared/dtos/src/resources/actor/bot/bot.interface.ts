import { IActor } from '../actor.interface';
import { IIndividual } from '../individual/individual.interface';
import { BotProps } from './bot.props';

export type IBot = IIndividual &
  BotProps & {
    owner?: IActor;
  };
