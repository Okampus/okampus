import { BaseEntity } from '../base/base.entity';
import { ManyToOne, Property } from '@mikro-orm/core';
import type { TenantCore } from '../../../resources/org/tenant/tenant-core.entity';
import type { TenantScopedOptions } from './tenant-scoped.options';

export abstract class TenantScopedEntity extends BaseEntity {
  @ManyToOne({ type: 'TenantCore' })
  tenant!: TenantCore;

  @Property({ type: Date, nullable: true })
  lastHiddenAt: Date | null = null;

  constructor(options: TenantScopedOptions) {
    super();
    this.assign(options);
  }
}
