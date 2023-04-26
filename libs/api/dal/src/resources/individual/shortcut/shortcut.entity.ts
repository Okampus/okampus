import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { ShortcutType } from '@okampus/shared/enums';
import { Entity, Enum, EnumType, ManyToOne } from '@mikro-orm/core';

import type { UserInfo } from '../user-info/user-info.entity';
import type { Actor } from '../../actor/actor.entity';
import type { ShortcutOptions } from './shortcut.options';

@Entity()
export class Shortcut extends TenantScopedEntity {
  @Enum({ items: () => ShortcutType, type: EnumType })
  type!: ShortcutType;

  @ManyToOne({ type: 'UserInfo' })
  user!: UserInfo;

  @ManyToOne({ type: 'Actor' })
  targetActor!: Actor;

  constructor(options: ShortcutOptions) {
    super(options);
    this.assign(options);
  }
}