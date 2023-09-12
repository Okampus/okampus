// eslint-disable-next-line import/no-cycle
import { BaseEntity } from '.';
import { ManyToOne, Property } from '@mikro-orm/core';

import type { BaseOptions } from './base.options';
import type { Tenant } from './tenant/tenant.entity';

export type TenantScopedOptions = BaseOptions & { tenantScope: Tenant };

export abstract class TenantScopedEntity extends BaseEntity {
  @ManyToOne({ type: 'Tenant' })
  tenantScope!: Tenant;

  constructor(options: TenantScopedOptions) {
    super();
    this.assign(options);
  }
}

export abstract class TenantScopedHiddableEntity extends BaseEntity {
  @ManyToOne({ type: 'Tenant' })
  tenantScope!: Tenant;

  @Property({ type: Date, nullable: true, default: null })
  hiddenAt: Date | null = null;

  constructor(options: TenantScopedOptions) {
    super();
    this.assign(options);
  }
}

export type TenantScopableOptions = BaseOptions & { tenantScope?: Tenant };

export abstract class TenantScopableEntity extends BaseEntity {
  @ManyToOne({ type: 'Tenant', nullable: true, default: null })
  tenantScope: Tenant | null = null;

  constructor(options: TenantScopableOptions) {
    super();
    this.assign(options);
  }
}
