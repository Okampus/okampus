// eslint-disable-next-line import/no-cycle
import { BaseEntity } from '.';
import { ManyToOne, Property } from '@mikro-orm/core';
import type { Tenant } from './tenant/tenant.entity';
import type { TenantScopedOptions } from './tenant-scoped.options';

export abstract class TenantScopedEntity extends BaseEntity {
  @ManyToOne({ type: 'Tenant' })
  tenant!: Tenant;

  @Property({ type: Date, nullable: true, default: null })
  hiddenAt: Date | null = null;

  constructor(options: TenantScopedOptions) {
    super();
    this.assign(options);
  }
}
