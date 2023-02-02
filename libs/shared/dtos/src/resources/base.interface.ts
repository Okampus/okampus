import { Snowflake } from '@okampus/shared/types';

export type IBase = {
  id: Snowflake;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
