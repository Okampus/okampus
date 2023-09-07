import { EventOrganizeRepository } from './event-organize.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Collection, Entity, EntityRepositoryType, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import type { EventOrganizeOptions } from './event-organize.options';
import type { Event } from '../event.entity';
import type { EventSupervisor } from '../event-supervisor/event-supervisor.entity';
import type { Mission } from '../../team/mission/mission.entity';
import type { Project } from '../../team/project/project.entity';
import type { Team } from '../../team/team.entity';

@Entity({ customRepository: () => EventOrganizeRepository })
export class EventOrganize extends TenantScopedEntity {
  [EntityRepositoryType]!: EventOrganizeRepository;

  @Property({ type: 'text', default: '' })
  description = '';

  @ManyToOne({ type: 'Event' })
  event!: Event;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  @OneToMany({ type: 'Mission', mappedBy: 'eventManage' })
  @TransformCollection()
  missions = new Collection<Mission>(this);

  @OneToMany({ type: 'EventSupervisor', mappedBy: 'eventOrganize' })
  @TransformCollection()
  supervisors = new Collection<EventSupervisor>(this);

  constructor(options: EventOrganizeOptions) {
    super(options);
    this.assign(options);
  }
}
