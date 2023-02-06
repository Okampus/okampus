import type { ShortcutProps } from '@okampus/shared/dtos';
import type { Actor } from '../actor.entity';
import type { User } from '../user/user.entity';

export type ShortcutOptions = ShortcutProps & {
  user: User;
  targetActor: Actor;
};
