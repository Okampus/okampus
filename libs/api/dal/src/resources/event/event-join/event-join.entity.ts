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
  Property,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { ApprovalState, ProcessedVia } from '@okampus/shared/enums';

import type { MissionJoin } from '../../team/mission-join/mission-join.entity';
import type { Individual } from '../../individual/individual.entity';
import type { User } from '../../individual/user/user.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { EventJoinOptions } from './event-join.options';
import type { Event } from '../event.entity';
import type { Action } from '../../team/action/action.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { EventManage } from '../event-manage/event-manage.entity';

@Entity({ customRepository: () => EventJoinRepository })
export class EventJoin extends TenantScopedEntity {
  [EntityRepositoryType]!: EventJoinRepository;

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @Property({ type: 'boolean', nullable: true, default: null })
  isParticipant: boolean | null = null;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  processedBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  processedAt: Date | null = null;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  participationProcessedBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  participationProcessedAt: Date | null = null;

  @Enum({ items: () => ProcessedVia, type: EnumType, nullable: true })
  participationProcessedVia: ProcessedVia | null = null;

  @ManyToOne({ type: 'Event' })
  event!: Event;

  @ManyToOne({ type: 'User' })
  joinedBy!: User;

  @ManyToOne({ type: 'EventManage', nullable: true, default: null })
  joinedFor: EventManage | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  qrCode: FileUpload | null = null;

  @ManyToOne({ type: 'MissionJoin', nullable: true, default: null })
  missionJoin: MissionJoin | null = null;

  @OneToMany({ type: 'Action', mappedBy: 'eventJoin' })
  @TransformCollection()
  actions = new Collection<Action>(this);

  @ManyToOne({ type: 'FormSubmission', nullable: true, default: null })
  formSubmission: FormSubmission | null = null;

  constructor(options: EventJoinOptions) {
    super(options);
    this.assign(options);
  }
}
