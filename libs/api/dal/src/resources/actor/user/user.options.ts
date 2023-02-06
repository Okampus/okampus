import type { UserProps } from '@okampus/shared/dtos';
import type { IndividualOptions } from '../individual/individual.options';
import type { ShortcutOptions } from '../shortcut/shortcut.options';

export type UserOptions = UserProps &
  Omit<IndividualOptions, 'name'> & {
    passwordHash?: string;
    name?: string;
    shortcuts?: ShortcutOptions[];
  };
