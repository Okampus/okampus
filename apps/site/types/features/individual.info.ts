import type { ActorMinimalInfo } from './actor.info';

export type IndividualMinimalInfo = {
  user?: { id: string } | null;
  actor: ActorMinimalInfo;
};
