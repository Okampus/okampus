import { UserProfileProps } from '@okampus/shared/dtos';
import type { User } from '../user/user.entity';

export type UserProfileOptions = UserProfileProps & { user: User };
