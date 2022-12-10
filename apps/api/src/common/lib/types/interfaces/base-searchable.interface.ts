import type { BaseIndex } from '@common/modules/search/indexed-entity.interface';
import type { BaseTenantEntity } from '@lib/entities/base-tenant.entity';

export interface BaseSearchableEntity extends Omit<BaseTenantEntity, 'assign'> {
  id: number | string;
  isPublic: boolean;
  toIndexed(): BaseIndex | Promise<BaseIndex>;
}
