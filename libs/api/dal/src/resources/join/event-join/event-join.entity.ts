import { Join } from '../join.entity';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { RegistrationStatus } from '@okampus/shared/enums';
import { JoinKind } from '@okampus/shared/enums';
import { formatDateDayOfWeek } from '@okampus/shared/utils';

import type { Individual } from '../../actor/individual/individual.entity';
import type { EventJoinOptions } from './event-join.options';
import type { TeamAction } from '../../manage-team/team-action/team-action.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { User } from '@sentry/node';

@Entity()
export class EventJoin extends Join {
  @ManyToOne({ type: 'TenantEvent' })
  event!: TenantEvent;

  @Property({ type: 'boolean', nullable: true })
  participated: boolean | null = null;

  @ManyToOne({ type: 'TeamAction', nullable: true })
  teamAction: TeamAction | null = null;

  @Enum({ items: () => RegistrationStatus, type: 'string' })
  presenceStatus!: RegistrationStatus;

  constructor(options: EventJoinOptions) {
    super({ ...options, joinKind: JoinKind.EventJoin });
    this.assign({ ...options, joinKind: JoinKind.EventJoin });
  }
}

export const getEventJoinDescription = (issuer: Individual | null, joiner: User, event: TenantEvent): string => {
  const now = formatDateDayOfWeek(new Date());
  const start = issuer
    ? `Invitation de ${issuer.actor.name} à ${joiner.actor.name}`
    : `Demande de ${joiner.actor.name}`;

  return `${start} pour rejoindre ${event.title} (${now})`;
};
