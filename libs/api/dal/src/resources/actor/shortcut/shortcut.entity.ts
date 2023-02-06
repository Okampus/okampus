import { ShortcutRepository } from './shortcut.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { ShortcutType } from '@okampus/shared/enums';
import type { Actor } from '../actor.entity';
import type { User } from '../user/user.entity';
import type { ShortcutOptions } from './shortcut.options';

@Entity({ customRepository: () => ShortcutRepository })
export class Shortcut extends TenantScopedEntity {
  @Enum({ items: () => ShortcutType, type: 'string' })
  type!: ShortcutType;

  @ManyToOne({ type: 'User' })
  user!: User;

  @ManyToOne({ type: 'Actor' })
  targetActor!: Actor;

  constructor(options: ShortcutOptions) {
    super({ tenant: options.user.tenant });
    this.assign(options);
  }
}
