import { EventRepository } from './event.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';

import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { EventState } from '@okampus/shared/enums';

import { toSlug } from '@okampus/shared/utils';
import type { Address } from '../actor/address/address.entity';
import type { EventApprovalStep } from '../tenant/event-approval-step/event-approval-step.entity';
import type { EventApproval } from '../tenant/event-approval/event-approval.entity';
import type { EventOptions } from './event.options';
import type { EventJoin } from './event-join/event-join.entity';
import type { Form } from '../form/form.entity';
import type { FormSubmission } from '../form-submission/form-submission.entity';
import type { Project } from '../project/project.entity';
import type { Searchable } from '../../types/search-entity.type';
import type { Tag } from '../actor/tag/tag.entity';
import type { Team } from '../team/team.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { UserInfo } from '../individual/user-info/user-info.entity';
import type { JSONObject } from '@okampus/shared/types';
import type { EventManage } from './event-manage/event-manage.entity';
import type { Content } from '../content/content.entity';

@Entity({ customRepository: () => EventRepository })
export class Event extends TenantScopedEntity implements Searchable {
  [EntityRepositoryType]!: EventRepository;

  // TODO: add how long can people register/unregister before event
  // TODO: add max participants
  // TODO: add co-organisers as prop
  @Property({ type: 'datetime' })
  start!: Date;

  @Property({ type: 'datetime' })
  end!: Date;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  slug!: string;

  @Property({ type: 'float', default: 0 })
  price = 0;

  @Property({ type: 'float', default: 0 })
  pointsPresence = 0;

  @Property({ type: 'smallint', nullable: true, default: null })
  maxParticipants: number | null = null;

  @Enum({ items: () => EventState, type: EnumType, default: EventState.Draft })
  state = EventState.Draft;

  @Property({ type: 'boolean', default: false })
  @Index()
  isPrivate = false;

  @Property({ type: 'boolean', default: true })
  autoAcceptJoins = true;

  @Property({ type: 'json', default: '{}' })
  meta: JSONObject = {};

  @Property({ type: 'text', nullable: true, default: null })
  onlineMeetingPlace: string | null = null;

  @Property({ type: 'text', nullable: true, default: null })
  onlineMeetingLink: string | null = null;

  @Property({ type: 'boolean', default: false })
  isTemplate = false;

  @ManyToOne({ type: 'Address', nullable: true, default: null })
  address: Address | null = null;

  @OneToOne({ type: 'Content', onDelete: 'CASCADE' })
  content!: Content; // Description

  @OneToOne({ type: 'FormSubmission', nullable: true, default: null })
  approvalSubmission: FormSubmission | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null, cascade: [Cascade.ALL] })
  banner: FileUpload | null = null;

  @ManyToOne({ type: 'Form', nullable: true, default: null })
  joinForm: Form | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  @ManyToOne({ type: 'EventApprovalStep', nullable: true, default: null })
  lastEventApprovalStep: EventApprovalStep | null = null;

  @ManyToMany({ type: 'UserInfo' })
  @TransformCollection()
  supervisors = new Collection<UserInfo>(this);

  @ManyToMany({ type: 'Team', mappedBy: 'events' })
  @TransformCollection()
  teams = new Collection<Team>(this);

  @OneToMany({ type: 'EventApproval', mappedBy: 'event' })
  @TransformCollection()
  eventApprovals = new Collection<EventApproval>(this);

  @OneToMany({ type: 'EventJoin', mappedBy: 'event' })
  @TransformCollection()
  eventJoins = new Collection<EventJoin>(this);

  @OneToMany({ type: 'EventManage', mappedBy: 'event' })
  @TransformCollection()
  eventManages = new Collection<EventManage>(this);

  constructor(options: EventOptions) {
    super(options);
    this.assign(options);

    if (!options.slug) this.slug = toSlug(this.name);
  }
}
