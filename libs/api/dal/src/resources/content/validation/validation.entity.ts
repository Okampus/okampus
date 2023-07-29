import { ValidationRepository } from './validation.repository';
import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { ValidationType } from '@okampus/shared/enums';
import type { ValidationOptions } from './validation.options';
import type { Content } from '../content.entity';

@Entity({ customRepository: () => ValidationRepository })
@WithActive()
export class Validation extends TenantScopedEntity {
  [EntityRepositoryType]!: ValidationRepository;

  @Property()
  type!: ValidationType;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: ValidationOptions) {
    super(options);
    this.assign(options);
  }
}
