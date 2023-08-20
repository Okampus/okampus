import type { ActorMinimalInfo } from './actor.info';

export type IndividualMinimalInfo = {
  id?: string;
  user?: { id: string } | null;
  actor: ActorMinimalInfo;
};
