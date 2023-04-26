import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne } from '@mikro-orm/core';

import type { Canteen } from '../canteen.entity';
import type { CanteenMenuOptions } from './canteen-menu.options';

@Entity()
export class CanteenMenu extends TenantScopedEntity {
  @ManyToOne({ type: 'Canteen' })
  canteen!: Canteen;

  constructor(options: CanteenMenuOptions) {
    super(options);
    this.assign(options);
  }
}
