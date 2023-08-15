import type { LegalUnitLocationMinimalInfo } from './legal-unit-location.info';

export type BankMinimalInfo = {
  id: string;
  legalUnitLocation?: LegalUnitLocationMinimalInfo | null;
  bicSwift: string;
  holderName?: string;
  iban: string;
};
