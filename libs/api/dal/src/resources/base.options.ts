import type { User } from './user/user.entity';

export type BaseOptions = {
  createdBy?: User | null;
};
