import type { LegalUnitLocation } from '../legal-unit-location/legal-unit-location.entity';
import type { Actor } from '../actor.entity';
import type { BankInfoProps } from './bank-info.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';

export type BankInfoOptions = BankInfoProps &
  TenantScopedOptions & {
    actor: Actor;
    legalUnitLocation?: LegalUnitLocation | null;
  };
