import { BaseEntity } from '../base/base.entity';
import { ManyToOne, Property } from '@mikro-orm/core';
import type { TenantCore } from '../../../resources/org/tenant/tenant-core.entity';
import type { TenantScopedOptions } from './tenant-scoped.options';
import type { Individual } from '../../../resources/actor/individual/individual.entity';

export abstract class TenantScopedEntity extends BaseEntity {
  @ManyToOne({ type: 'TenantCore' })
  tenant!: TenantCore;

  @ManyToOne({ type: 'Individual', nullable: true })
  createdBy: Individual | null = null; // null for system

  @Property({ type: Date, nullable: true })
  lastHiddenAt: Date | null = null;

  constructor(options: TenantScopedOptions) {
    super();
    this.assign(options);
  }
}
