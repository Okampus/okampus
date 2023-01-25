import { ShortcutProps } from '@okampus/shared/dtos';
import type { User } from '../user/user.entity';

export type ShortcutOptions = ShortcutProps & { user: User };
