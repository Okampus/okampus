import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core';

import type { EventChangeRoleOptions } from './event-change-role.options';
import type { EventJoin } from '../event-join/event-join.entity';
import type { EventRole } from '../event-role/event-role.entity';

@Entity()
export class EventChangeRole extends TenantScopedEntity {
  @OneToOne({ type: 'EventJoin', mappedBy: 'eventChangeRole' })
  eventJoin!: EventJoin;

  @ManyToOne({ type: 'EventRole', nullable: true, default: null })
  receivedRole: EventRole | null = null;

  @Property({ type: 'bpolean' })
  accepted!: boolean;

  @Property({ type: 'text' })
  note = '';

  constructor(options: EventChangeRoleOptions) {
    super(options);
    this.assign(options);
  }
}
