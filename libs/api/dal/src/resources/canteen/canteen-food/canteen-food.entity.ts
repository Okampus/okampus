import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne } from '@mikro-orm/core';

import type { Canteen } from '../canteen.entity';
import type { CanteenFoodOptions } from './canteen-food.options';

@Entity()
export class CanteenFood extends TenantScopedEntity {
  @ManyToOne({ type: 'Canteen' })
  canteen!: Canteen;

  constructor(options: CanteenFoodOptions) {
    super(options);
    this.assign(options);
  }
}
