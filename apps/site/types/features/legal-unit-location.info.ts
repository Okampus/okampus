import type { ActorMinimalInfo } from './actor.info';
import type { LegalUnitMinimalInfo } from './legal-unit.info';
import type { LocationMinimalInfo } from './location.info';

export type LegalUnitLocationMinimalInfo = {
  id: string;
  legalName: string;
  actor: ActorMinimalInfo;
  location?: LocationMinimalInfo | null;
  legalUnit?: LegalUnitMinimalInfo | null;
};
