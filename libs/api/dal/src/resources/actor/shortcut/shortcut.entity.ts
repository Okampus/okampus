import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import type { User } from '../user/user.entity';
import { ShortcutOptions } from './shortcut.options';

@Entity()
export class Shortcut extends TenantScopedEntity {
  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string' })
  subroute!: string;

  @Property({ type: 'string' })
  resourceId!: string;

  @ManyToOne({ type: 'User', inversedBy: 'shortcuts' })
  user!: User;

  constructor(options: ShortcutOptions) {
    super({ tenant: options.user.tenant });
    this.assign(options);
  }
}
