import type { BaseIndex } from '../../../modules/search/meilisearch.global';
import type { BaseTenantEntity } from '../../entities/tenant.entity';

export interface BaseSearchableEntity extends Omit<BaseTenantEntity, 'assign'> {
  id: number | string;
  isPublic: boolean;
  toIndexed(): BaseIndex;
}
