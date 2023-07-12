import type { LegalUnitLocation } from '../legal-unit-location/legal-unit-location.entity';
import type { Actor } from '../actor.entity';
import type { BankInfoProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type BankInfoOptions = BankInfoProps &
  TenantScopedOptions & {
    actor: Actor;
    bank?: LegalUnitLocation | null;
  };
