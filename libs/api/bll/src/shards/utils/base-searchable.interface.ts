import type { TenantScopedEntity } from '@okampus/api/dal';
import type { Snowflake } from '@okampus/shared/types';
import type { BaseIndex } from '../../features/search/indexed-entity.interface';

export interface BaseSearchableEntity extends Omit<TenantScopedEntity, 'assign'> {
  id: Snowflake;
  isPublic: boolean;
  toIndexed(): BaseIndex | Promise<BaseIndex>;
}
