import { EventSupervisorRepository } from './event-supervisor.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { EventSupervisorOptions } from './event-supervisor.options';
import type { EventOrganize } from '../event-organize/event-organize.entity';
import type { TeamMember } from '../../team/team-member/team-member.entity';

@Entity({ customRepository: () => EventSupervisorRepository })
export class EventSupervisor extends TenantScopedEntity {
  [EntityRepositoryType]!: EventSupervisorRepository;

  @Property({ type: 'text', nullable: true, default: null })
  title: string | null = null;

  @ManyToOne({ type: 'TeamMember' })
  teamMember!: TeamMember;

  @ManyToOne({ type: 'EventOrganize' })
  eventOrganize!: EventOrganize;

  constructor(options: EventSupervisorOptions) {
    super(options);
    this.assign(options);
  }
}
