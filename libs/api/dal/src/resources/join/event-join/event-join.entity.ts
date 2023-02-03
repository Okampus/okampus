import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { EventJoinOptions } from './event-join.options';
import { Join } from '../join.entity';
import { RegistrationStatus } from '@okampus/shared/enums';
import { JoinKind } from '@okampus/shared/enums';
import { TeamAction } from '../../manage-team/team-action/team-action.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';

@Entity()
export class EventJoin extends Join {
  @ManyToOne({ type: 'TenantEvent' })
  event!: TenantEvent;

  @Property({ type: 'boolean', nullable: true })
  participated: boolean | null = null;

  @ManyToOne({ type: 'TeamAction', nullable: true })
  teamAction: TeamAction | null = null;

  @Enum(() => RegistrationStatus)
  presenceStatus!: RegistrationStatus;

  constructor(options: EventJoinOptions) {
    super({ ...options, joinKind: JoinKind.EventJoin });
    this.assign({ ...options, joinKind: JoinKind.EventJoin });
  }
}
