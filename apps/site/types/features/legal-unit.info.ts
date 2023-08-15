import type { ActorMinimalInfo } from './actor.info';

export type LegalUnitMinimalInfo = {
  id: string;
  legalName: string;
  actor: ActorMinimalInfo;
};
