import { EventAttendanceRepository } from './event-attendance.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { AttendanceConfirmedVia } from '@okampus/shared/enums';
import type { EventJoin } from '../event-join/event-join.entity';

import type { EventAttendanceOptions } from './event-attendance.options';

@Entity({ customRepository: () => EventAttendanceRepository })
export class EventAttendance extends TenantScopedEntity {
  [EntityRepositoryType]!: EventAttendanceRepository;

  @ManyToOne({ type: 'EventJoin', inversedBy: 'eventAttendances' })
  eventJoin!: EventJoin;

  @Property({ type: 'boolean' })
  participated!: boolean;

  @Enum({ items: () => AttendanceConfirmedVia, type: EnumType })
  confirmedVia!: AttendanceConfirmedVia;

  constructor(options: EventAttendanceOptions) {
    super(options);
    this.assign(options);
  }
}
