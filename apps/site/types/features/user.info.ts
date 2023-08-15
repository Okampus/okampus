import type { ActorBaseInfo, ActorMinimalInfo } from './actor.info';

export type UserMinimalInfo = {
  id: string;
  individual: {
    actor: ActorMinimalInfo;
  };
};

export type UserBaseInfo = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  individual: {
    actor: ActorBaseInfo;
  };
};
