import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import type { ValidationType } from '@okampus/shared/enums';
import type { ValidationOptions } from './validation.options';
import type { Content } from '../content.entity';

@Entity()
@WithActive()
export class Validation extends TenantScopedEntity {
  @Property()
  type!: ValidationType;

  @Property({ type: 'datetime', nullable: true, default: null })
  lastActiveDate: Date | null = null;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: ValidationOptions) {
    super(options);
    this.assign(options);
  }
}
