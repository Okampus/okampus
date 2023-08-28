import type { ActorBaseInfo, ActorMinimalInfo } from './actor.info';

export type TeamMinimalInfo = {
  id: string;
  actor: ActorMinimalInfo;
};

export type TeamCardInfo = TeamMinimalInfo & {
  actor: ActorBaseInfo;
  teamMembersAggregate: {
    aggregate: {
      count: number;
    } | null;
  };
};
