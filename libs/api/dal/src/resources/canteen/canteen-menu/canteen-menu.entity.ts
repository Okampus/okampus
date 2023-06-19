import { CanteenMenuRepository } from './canteen-menu.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { Canteen } from '../canteen.entity';
import type { CanteenMenuOptions } from './canteen-menu.options';

@Entity({ customRepository: () => CanteenMenuRepository })
export class CanteenMenu extends TenantScopedEntity {
  [EntityRepositoryType]!: CanteenMenuRepository;

  @ManyToOne({ type: 'Canteen' })
  canteen!: Canteen;

  constructor(options: CanteenMenuOptions) {
    super(options);
    this.assign(options);
  }
}
