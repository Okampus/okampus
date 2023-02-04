import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { ShortcutType } from '@okampus/shared/enums';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import type { Actor } from '../actor.entity';
import type { User } from '../user/user.entity';
import type { ShortcutOptions } from './shortcut.options';

import { ShortcutRepository } from './shortcut.repository';

@Entity({ customRepository: () => ShortcutRepository })
export class Shortcut extends TenantScopedEntity {
  @Enum(() => ShortcutType)
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
