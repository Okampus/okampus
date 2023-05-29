import { EventJoinRepository } from './event-join.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { ApprovalState, AttendanceStatus } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';

import type { EventAttendance } from '../event-attendance/event-attendance.entity';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { EventJoinOptions } from './event-join.options';
import type { Event } from '../event.entity';
import type { EventRole } from '../event-role/event-role.entity';
import type { Action } from '../../team/action/action.entity';
import type { EventChangeRole } from '../event-change-role/event-change-role.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

@Entity({ customRepository: () => EventJoinRepository })
export class EventJoin extends TenantScopedEntity {
  [EntityRepositoryType]!: EventJoinRepository;

  @ManyToOne({ type: 'Event' })
  event!: Event;

  @ManyToOne({ type: 'EventRole', nullable: true, default: null })
  eventRole: EventRole | null = null;

  @Property({ type: 'boolean', nullable: true, default: null })
  participated: boolean | null = null;

  @ManyToOne({ type: 'Action', nullable: true, default: null })
  action: Action | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  qrCode: FileUpload | null = null;

  @OneToMany({ type: 'EventAttendance', mappedBy: 'eventJoin' })
  @TransformCollection()
  eventAttendances = new Collection<EventAttendance>(this);

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @Enum({ items: () => AttendanceStatus, type: EnumType, default: AttendanceStatus.Sure })
  attendanceStatus = AttendanceStatus.Sure;

  @ManyToOne({ type: 'UserInfo' })
  joiner!: UserInfo;

  @ManyToOne({ type: 'FormSubmission', nullable: true, default: null })
  formSubmission: FormSubmission | null = null;

  @OneToOne({ type: 'EventChangeRole', inversedBy: 'eventJoin', nullable: true })
  eventChangeRole: EventChangeRole | null = null;

  constructor(options: EventJoinOptions) {
    super(options);
    this.assign(options);
  }
}
