import { UgcProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Individual } from '../actor/individual/individual.entity';
import type { ContentMaster } from '../content-master/content-master.entity';
import { Org } from '../org/org.entity';

export type UgcOptions = UgcProps &
  TenantScopedOptions & {
    realAuthor: Individual;
    org?: Org | null;
    contentMaster?: ContentMaster | null;
  };
