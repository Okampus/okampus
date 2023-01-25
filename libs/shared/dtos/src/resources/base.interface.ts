import { UUID } from '@okampus/shared/types';

export type IBaseEntity = {
  id: UUID;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
