import type { LegalUnitProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Actor } from '../actor.entity';

export type LegalUnitOptions = LegalUnitProps &
  TenantScopedOptions & {
    actor: Actor;
  };
