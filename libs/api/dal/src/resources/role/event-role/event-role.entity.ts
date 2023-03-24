import { Role } from '../role.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RoleKind } from '@okampus/shared/enums';

import type { EventRoleOptions } from './event-role.options';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { User } from '../../actor/user/user.entity';
import type { ProjectRole } from '../project-role/project-role.entity';

@Entity()
export class EventRole extends Role {
  @ManyToOne({ type: 'ProjectRole' })
  linkedProjectRole!: ProjectRole;

  @ManyToOne({ type: 'TenantEvent' })
  event!: TenantEvent;

  @ManyToOne({ type: 'User', nullable: true })
  user: User | null = null;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'boolean' })
  autoAccept = true;

  @Property({ type: 'smallint', nullable: true })
  rewardMinimum: number | null = null;

  @Property({ type: 'smallint', nullable: true })
  rewardMaximum: number | null = null;

  constructor(options: EventRoleOptions) {
    super({ ...options, roleKind: RoleKind.ProjectRole });
    this.assign({ ...options, roleKind: RoleKind.ProjectRole });
  }
}
