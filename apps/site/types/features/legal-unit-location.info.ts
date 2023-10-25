import type { ActorMinimalInfo } from './actor.info';
import type { LegalUnitMinimalInfo } from './legal-unit.info';
import type { LocationMinimal } from './location.info';

export type LegalUnitLocationMinimal = {
  id: string;
  legalName: string;
  actor: ActorMinimalInfo;
  location?: LocationMinimal | null;
  legalUnit?: LegalUnitMinimalInfo | null;
};
