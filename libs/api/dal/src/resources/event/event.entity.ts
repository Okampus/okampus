import { EventRepository } from './event.repository';
import { TenantScopedHiddableEntity } from '../tenant-scoped.entity';

import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { EventState } from '@okampus/shared/enums';
import { randomId, toSlug } from '@okampus/shared/utils';

import type { JSONObject } from '@okampus/shared/types';
import type { EventOptions } from './event.options';
import type { EventOrganize } from './event-organize/event-organize.entity';
import type { Form } from '../form/form.entity';
import type { Location } from '../location/location.entity';
import type { EventJoin } from './event-join/event-join.entity';
import type { FormSubmission } from '../form/form-submission/form-submission.entity';
import type { EventApprovalStep } from '../tenant/event-approval-step/event-approval-step.entity';
import type { EventApproval } from '../tenant/event-approval/event-approval.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';

import type { Searchable } from '../../types/search-entity.type';

@Entity({ customRepository: () => EventRepository })
export class Event extends TenantScopedHiddableEntity implements Searchable {
  [EntityRepositoryType]!: EventRepository;

  // TODO: add how long can people register/unregister before event
  @Property({ type: 'datetime' })
  start!: Date;

  @Property({ type: 'datetime' })
  end!: Date;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  description = '';

  @Unique()
  @Property({ type: 'text' })
  slug!: string;

  @Property({ type: 'float', default: 0 })
  price = 0;

  @Property({ type: 'float', default: 0 })
  pointsAwardedForAttendance = 0;

  @Property({ type: 'smallint', nullable: true, default: null })
  maxParticipants: number | null = null;

  @Enum({ items: () => EventState, type: EnumType, default: EventState.Draft })
  state = EventState.Draft;

  @Property({ type: 'boolean', default: false })
  @Index()
  isPrivate = false;

  @Property({ type: 'boolean', default: true })
  isAutoAcceptingJoins = true;

  @Property({ type: 'boolean', default: false })
  isTemplate = false;

  @Property({ type: 'json', default: '{}' })
  meta: JSONObject = {};

  @ManyToOne({ type: 'Location' })
  location!: Location;

  @OneToOne({ type: 'FormSubmission', nullable: true, default: null })
  eventApprovalSubmission: FormSubmission | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null, cascade: [Cascade.ALL] })
  banner: FileUpload | null = null;

  @ManyToOne({ type: 'Form', nullable: true, default: null })
  joinForm: Form | null = null;

  @ManyToOne({ type: 'EventApprovalStep', nullable: true, default: null })
  nextEventApprovalStep: EventApprovalStep | null = null;

  @OneToMany({ type: 'EventApproval', mappedBy: 'event' })
  @TransformCollection()
  eventApprovals = new Collection<EventApproval>(this);

  @OneToMany({ type: 'EventJoin', mappedBy: 'event' })
  @TransformCollection()
  eventJoins = new Collection<EventJoin>(this);

  @OneToMany({ type: 'EventOrganize', mappedBy: 'event' })
  @TransformCollection()
  eventOrganizes = new Collection<EventOrganize>(this);

  constructor(options: EventOptions) {
    super(options);
    this.assign(options);

    this.slug = toSlug(`${options.slug ?? options.name}-${randomId()}`);
  }
}
