import type { LegalUnitLocationMinimal } from './legal-unit-location.info';

export type BankInfoMinimalInfo = {
  id: string;
  legalUnitLocation?: LegalUnitLocationMinimal | null;
  bicSwift: string;
  holderName?: string;
  iban: string;
};
