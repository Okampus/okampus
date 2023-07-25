import { EventSupervisorRepository } from './event-supervisor.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { EventSupervisorOptions } from './event-supervisor.options';
import type { User } from '../../individual/user/user.entity';
import type { EventOrganize } from '../event-organize/event-organize.entity';

@Entity({ customRepository: () => EventSupervisorRepository })
export class EventSupervisor extends TenantScopedEntity {
  [EntityRepositoryType]!: EventSupervisorRepository;

  @Property({ type: 'text', default: '' })
  title = '';

  @ManyToOne({ type: 'User' })
  user!: User;

  @ManyToOne({ type: 'EventOrganize' })
  eventOrganize!: EventOrganize;

  constructor(options: EventSupervisorOptions) {
    super(options);
    this.assign(options);
  }
}
