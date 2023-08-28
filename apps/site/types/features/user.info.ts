import type { ActorBaseInfo, ActorMinimalInfo } from './actor.info';

export type UserMinimalInfo = {
  id: string;
  actor: ActorMinimalInfo;
};

export type UserBaseInfo = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  actor: ActorBaseInfo;
};
