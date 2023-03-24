import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, Property } from '@mikro-orm/core';

import { Colors, RoleKind } from '@okampus/shared/enums';

import type { RoleOptions } from './role.options';

@Entity({ discriminatorColumn: 'roleKind', discriminatorMap: RoleKind, abstract: true })
export class Role extends TenantScopedEntity {
  @Enum({ items: () => RoleKind, type: 'string' })
  roleKind!: RoleKind;

  @Property({ type: 'text' })
  name!: string;

  @Enum({ items: () => Colors, type: 'string' })
  color!: Colors;

  @Property({ type: 'boolean' })
  required = false;

  constructor(options: RoleOptions & { roleKind: RoleKind }) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);
  }
}
