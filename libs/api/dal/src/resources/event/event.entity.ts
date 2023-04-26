import { EventRepository } from './event.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Form } from '../form/form.entity';
import { Content } from '../content/content.entity';
import { ContentMaster } from '../content-master/content-master.entity';
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

import { ContentMasterType, EventState, FormType } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';

import type { ActorAddress } from '../actor/actor-address/actor-address.entity';
import type { EventApprovalStep } from '../tenant/event-approval-step/event-approval-step.entity';
import type { EventApproval } from '../tenant/event-approval/event-approval.entity';
import type { EventOptions } from './event.options';
import type { EventJoin } from './event-join/event-join.entity';
import type { EventRole } from './event-role/event-role.entity';
import type { FormSubmission } from '../form-submission/form-submission.entity';
import type { Project } from '../project/project.entity';
import type { Searchable } from '../../types/search-entity.type';
import type { Tag } from '../actor/tag/tag.entity';
import type { Team } from '../team/team.entity';
import type { Upload } from '../upload/upload';
import type { UserInfo } from '../individual/user-info/user-info.entity';
import type { JSONObject } from '@okampus/shared/types';

@Entity({ customRepository: () => EventRepository })
export class Event extends TenantScopedEntity implements Searchable {
  [EntityRepositoryType]!: EventRepository;

  // TODO: add co-organisers as prop
  @Property({ type: 'datetime' })
  start!: Date;

  @Property({ type: 'datetime' })
  end!: Date;

  @Property({ type: 'text' })
  slug!: string;

  @Property({ type: 'float' })
  price = 0;

  @ManyToOne({ type: 'Upload', nullable: true, default: null, cascade: [Cascade.ALL] })
  image: Upload | null = null;

  @ManyToOne({ type: 'ActorAddress' })
  location!: ActorAddress;

  @Enum({ items: () => EventState, type: EnumType, default: EventState.Draft })
  state = EventState.Draft;

  @Property({ type: 'json' })
  meta: JSONObject = {};

  @ManyToMany({ type: 'Team' })
  @TransformCollection()
  organisingTeams = new Collection<Team>(this);

  @ManyToOne({ type: 'UserInfo' })
  supervisor!: UserInfo;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @OneToOne({ type: 'ContentMaster', inversedBy: 'event', nullable: true })
  content: ContentMaster | null = null;

  @ManyToMany({ type: 'Team' })
  @TransformCollection()
  teams = new Collection<Team>(this);

  @Property({ type: 'boolean' })
  autoAcceptJoins = true;

  @ManyToOne({ type: 'Form' })
  joinForm!: Form;

  @ManyToOne({ type: 'Project' })
  project!: Project;

  @ManyToOne({ type: 'Event', nullable: true, default: null })
  regularEvent: Event | null = null;

  @Property({ type: 'text', nullable: true, default: null })
  regularEventInterval: string | null = null; // TODO: use a custom interval type

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

  @Property({ type: 'boolean' })
  @Index()
  isPrivate = false;

  constructor(options: EventOptions) {
    super(options);
    this.assign(options);

    // Event description
    const description = new Content({
      text: options.text || '',
      teams: options.teams,
      createdBy: options.createdBy,
      tenant: options.tenant,
    });

    this.content = new ContentMaster({
      event: this,
      name: options.name,
      type: ContentMasterType.Event,
      rootContent: description,
      createdBy: options.createdBy,
      tenant: options.tenant,
    });

    this.joinForm = new Form({
      isTemplate: false,
      name: `Rejoindre ${options.name}`,
      schema: [],
      type: FormType.EventJoin,
      undeletable: true,
      createdBy: this.createdBy,
      tenant: this.tenant,
    });
  }
}
