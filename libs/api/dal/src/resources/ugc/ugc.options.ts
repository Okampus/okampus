import type { UgcProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Individual } from '../actor/individual/individual.entity';
import type { ContentMaster } from '../content-master/content-master.entity';
import type { Org } from '../org/org.entity';

export type UgcOptions = UgcProps &
  TenantScopedOptions & {
    realAuthor: Individual;
    representingOrg?: Org | null;
    contentMaster?: ContentMaster | null;
  };
