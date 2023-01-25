import { TenantScopedEntity } from '@okampus/api/dal';
import { UUID } from '@okampus/shared/types';
import { BaseIndex } from '../../features/search/indexed-entity.interface';

export interface BaseSearchableEntity extends Omit<TenantScopedEntity, 'assign'> {
  id: UUID;
  isPublic: boolean;
  toIndexed(): BaseIndex | Promise<BaseIndex>;
}
