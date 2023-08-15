import type { LegalUnitLocation } from '../legal-unit-location/legal-unit-location.entity';
import type { Actor } from '../actor.entity';
import type { BankProps } from './bank.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type BankOptions = BankProps &
  TenantScopedOptions & {
    actor: Actor;
    bank?: LegalUnitLocation | null;
  };
