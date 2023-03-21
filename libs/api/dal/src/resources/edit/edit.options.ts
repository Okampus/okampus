import type { EditProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Ugc } from '../ugc/ugc.entity';

export type EditOptions = EditProps &
  TenantScopedOptions & {
    linkedUgc: Ugc;
  };
