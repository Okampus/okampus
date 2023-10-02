import type { ActorBaseInfo, ActorMinimalInfo } from './actor.info';

export type UserMinimalInfo = {
  id: bigint | string;
  slug: string;
  actor: ActorMinimalInfo;
};

export type UserBaseInfo = UserMinimalInfo & {
  createdAt: Date | string;
  firstName: string;
  lastName: string;
  actor: ActorBaseInfo;
};
