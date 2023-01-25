import { UserProps } from '@okampus/shared/dtos';
import { IndividualOptions } from '../individual/individual.options';

export type UserOptions = UserProps &
  Omit<IndividualOptions, 'name'> & {
    passwordHash?: string;
    name?: string;
  };
