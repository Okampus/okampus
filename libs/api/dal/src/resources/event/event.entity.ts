import { EventRepository } from './event.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
// import { Content } from '../content/content.entity';
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
import {
  // ContentMasterType,
  EventState,
} from '@okampus/shared/enums';
import type { ContentMaster } from '../content-master/content-master.entity';
// import { toSlug } from '@okampus/shared/utils';

import type { ActorAddress } from '../actor/actor-address/actor-address.entity';
import type { EventApprovalStep } from '../tenant/event-approval-step/event-approval-step.entity';
import type { EventApproval } from '../tenant/event-approval/event-approval.entity';
import type { EventOptions } from './event.options';
import type { EventJoin } from './event-join/event-join.entity';
import type { EventRole } from './event-role/event-role.entity';
import type { Form } from '../form/form.entity';
import type { FormSubmission } from '../form-submission/form-submission.entity';
import type { Project } from '../project/project.entity';
import type { Searchable } from '../../types/search-entity.type';
import type { Tag } from '../actor/tag/tag.entity';
import type { Team } from '../team/team.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { UserInfo } from '../individual/user-info/user-info.entity';
import type { JSONObject } from '@okampus/shared/types';

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

  @Property({ type: 'float', default: 0 })
  price = 0;

  @Property({ type: 'float', default: 0 })
  presenceReward = 0;

  @Property({ type: 'boolean', default: false })
  @Index()
  isPrivate = false;

  @Property({ type: 'boolean', default: true })
  autoAcceptJoins = true;

  @Enum({ items: () => EventState, type: EnumType, default: EventState.Draft })
  state = EventState.Draft;

  @OneToOne({ type: 'ContentMaster', inversedBy: 'event' })
  contentMaster!: ContentMaster;

  @Property({ type: 'json', default: '{}' })
  meta: JSONObject = {};

  @Property({ type: 'float', nullable: true, default: null })
  budget: number | null = null;

  @ManyToOne({ type: 'ActorAddress', nullable: true, default: null })
  address: ActorAddress | null = null;

  @Property({ type: 'text', nullable: true, default: null })
  onlineMeetingPlace = null;

  @Property({ type: 'text', nullable: true, default: null })
  onlineMeetingLink = null;

  @ManyToOne({ type: 'UserInfo' })
  supervisor!: UserInfo;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null, cascade: [Cascade.ALL] })
  image: FileUpload | null = null;

  @ManyToMany({ type: 'Team', mappedBy: 'events' })
  @TransformCollection()
  teams = new Collection<Team>(this);

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @ManyToOne({ type: 'Form', nullable: true, default: null })
  joinForm: Form | null = null;

  @ManyToOne({ type: 'Project' })
  project!: Project;

  @OneToOne({ type: 'FormSubmission', nullable: true, default: null })
  approvalSubmission: FormSubmission | null = null;

  @ManyToOne({ type: 'EventApprovalStep', nullable: true, default: null })
  lastEventApprovalStep: EventApprovalStep | null = null;

  @OneToMany({ type: 'EventRole', mappedBy: 'event' })
  @TransformCollection()
  roles = new Collection<EventRole>(this);

  @OneToMany({ type: 'EventApproval', mappedBy: 'event' })
  @TransformCollection()
  eventApprovals = new Collection<EventApproval>(this);

  @OneToMany({ type: 'EventJoin', mappedBy: 'event' })
  @TransformCollection()
  eventJoins = new Collection<EventJoin>(this);

  constructor(options: EventOptions) {
    super(options);
    this.assign(options);

    // Event description
    // const description = new Content({
    //   text: options.text || '',
    //   teams: options.teams,
    //   createdBy: options.createdBy,
    //   tenant: options.tenant,
    // });

    // this.contentMaster = new ContentMaster({
    //   event: this,
    //   name: options.name,
    //   slug: toSlug(options.slug ?? options.name),
    //   type: ContentMasterType.Event,
    //   rootContent: description,
    //   createdBy: options.createdBy,
    //   tenant: options.tenant,
    // });
  }
}
