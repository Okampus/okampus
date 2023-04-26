import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { Colors } from '@okampus/shared/enums';

import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { ProjectRole } from '../../project/project-role/project-role.entity';
import type { Event } from '../event.entity';
import type { EventRoleOptions } from './event-role.options';

@Entity()
export class EventRole extends TenantScopedEntity {
  @ManyToOne({ type: 'UserInfo', nullable: true, default: null })
  user: UserInfo | null = null;

  @ManyToOne({ type: 'Event' })
  event!: Event;

  @ManyToOne({ type: 'ProjectRole' })
  projectRole!: ProjectRole;

  @Property({ type: 'text', default: '' })
  description!: string;

  @Property({ type: 'boolean' })
  autoAccept = true;

  @Property({ type: 'smallint', nullable: true, default: null })
  rewardMinimum: number | null = null;

  @Property({ type: 'smallint', nullable: true, default: null })
  rewardMaximum: number | null = null;

  @Property({ type: 'text' })
  name!: string;

  @Enum({ items: () => Colors, type: EnumType })
  color!: Colors;

  @Property({ type: 'boolean' })
  required = false;

  constructor(options: EventRoleOptions) {
    super(options);
    this.assign(options);
  }
}
