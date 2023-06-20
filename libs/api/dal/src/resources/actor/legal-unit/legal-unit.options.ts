import type { ActorOptions } from '../actor.options';
import type { LegalUnitProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type LegalUnitOptions = LegalUnitProps & Omit<ActorOptions, 'individual' | 'team'> & TenantScopedOptions;
