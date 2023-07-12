import { CanteenFoodRepository } from './canteen-food.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { Canteen } from '../canteen.entity';
import type { CanteenFoodOptions } from './canteen-food.options';

@Entity({ customRepository: () => CanteenFoodRepository })
export class CanteenFood extends TenantScopedEntity {
  [EntityRepositoryType]!: CanteenFoodRepository;

  @ManyToOne({ type: 'Canteen' })
  canteen!: Canteen;

  constructor(options: CanteenFoodOptions) {
    super(options);
    this.assign(options);
  }
}
