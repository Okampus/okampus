import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Enum, EnumType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { ApprovalState, RegistrationStatus } from '@okampus/shared/enums';

import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { EventJoinOptions } from './event-join.options';
import type { Event } from '../event.entity';
import type { EventRole } from '../event-role/event-role.entity';
import type { Action } from '../../team/action/action.entity';
import type { EventChangeRole } from '../event-change-role/event-change-role.entity';

@Entity()
export class EventJoin extends TenantScopedEntity {
  @ManyToOne({ type: 'Event' })
  event!: Event;

  @ManyToOne({ type: 'EventRole', nullable: true, default: null })
  eventRole: EventRole | null = null;

  @Property({ type: 'boolean', nullable: true, default: null })
  participated: boolean | null = null;

  @ManyToOne({ type: 'Action', nullable: true, default: null })
  action: Action | null = null;

  @Enum({ items: () => RegistrationStatus, type: EnumType })
  presenceStatus!: RegistrationStatus;

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @ManyToOne({ type: 'UserInfo' })
  joiner!: UserInfo;

  @ManyToOne({ type: 'FormSubmission' })
  formSubmission!: FormSubmission;

  @OneToOne({ type: 'EventChangeRole', inversedBy: 'eventJoin', nullable: true })
  eventChangeRole: EventChangeRole | null = null;

  constructor(options: EventJoinOptions) {
    super(options);
    this.assign(options);
  }
}
