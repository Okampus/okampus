import { EventManageRepository } from './event-manage.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import type { EventManageOptions } from './event-manage.options';
import type { Event } from '../event.entity';
import type { Team } from '../../team/team.entity';
import type { Mission } from '../../team/mission/mission.entity';
import type { TeamMember } from '../../team/team-member/team-member.entity';

@Entity({ customRepository: () => EventManageRepository })
export class EventManage extends TenantScopedEntity {
  [EntityRepositoryType]!: EventManageRepository;

  @Property({ type: 'text', default: '' })
  description = '';

  @ManyToOne({ type: 'Event' })
  event!: Event;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @OneToMany({ type: 'Mission', mappedBy: 'eventManage' })
  @TransformCollection()
  missions = new Collection<Mission>(this);

  @ManyToMany({ type: 'TeamMember' })
  @TransformCollection()
  supervisors = new Collection<TeamMember>(this);

  constructor(options: EventManageOptions) {
    super(options);
    this.assign(options);
  }
}
