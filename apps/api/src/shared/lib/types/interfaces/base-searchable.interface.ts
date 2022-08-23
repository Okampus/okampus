import type { BaseIndex } from '../../../modules/search/indexed-entity.interface';
import type { BaseTenantEntity } from '../../entities/base-tenant-entity';

export interface BaseSearchableEntity extends Omit<BaseTenantEntity, 'assign'> {
  id: number | string;
  isPublic: boolean;
  toIndexed(): BaseIndex;
}
