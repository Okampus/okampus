import { TenantEventRepository } from './event.repository';
import { ContentMaster } from '../content-master.entity';
import { Content } from '../../ugc/content/content.entity';
import { Form } from '../../ugc/form/form.entity';
import {
  Cascade,
  Collection,
  Embedded,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { EventState, FormType } from '@okampus/shared/enums';
import { ContentMasterKind } from '@okampus/shared/enums';
import { Address } from '@okampus/shared/dtos';
import { TransformCollection } from '@okampus/api/shards';
import type { Searchable } from '../../../types/search-entity.type';
import type { JSONObject } from '@okampus/shared/types';
import type { TenantEventOptions } from './event.options';
import type { EventApprovalStep } from '../../manage-tenant/event-approval-step/event-approval-step.entity';
import type { EventJoin } from '../../join/event-join/event-join.entity';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import type { User } from '../../actor/user/user.entity';
import type { FormSubmission } from '../../ugc/form-submission/form-submission.entity';
import type { EventApproval } from '../../manage-tenant/event-approval/event-approval.entity';

@Entity({
  customRepository: () => TenantEventRepository,
}) // Called "TenantEvent" to avoid name collision with native JS "Event"
export class TenantEvent extends ContentMaster implements Searchable {
  // TODO: add co-organisers as prop

  @Property({ type: 'datetime' })
  start!: Date;

  @Property({ type: 'datetime' })
  end!: Date;

  @Property({ type: 'float' })
  price = 0;

  @OneToOne({ type: 'ImageUpload', nullable: true, cascade: [Cascade.ALL] })
  image: ImageUpload | null = null;

  @Embedded(() => Address)
  location!: Address;

  @Enum({ items: () => EventState, type: 'string', default: EventState.Draft })
  state = EventState.Draft;

  @Property({ type: 'json' })
  meta: JSONObject = {};

  @ManyToOne({ type: 'User' })
  supervisor!: User;

  @Property({ type: 'boolean' })
  @Index()
  private = false;

  @ManyToOne({ type: 'Form' })
  joinForm = new Form({
    isTemplate: false,
    name: `Rejoindre ${this.title}`,
    realAuthor: null,
    schema: [],
    description: `Formulaire officiel pour rejoindre ${this.title}`,
    type: FormType.EventJoin,
    undeletable: true,
    tenant: this.tenant,
  });

  @ManyToOne({ type: 'TenantEvent', nullable: true })
  regularEvent: TenantEvent | null = null;

  @Property({ type: 'text', nullable: true })
  regularEventInterval: string | null = null; // TODO: use a custom interval type

  @OneToOne({ type: 'FormSubmission', nullable: true })
  approvalSubmission: FormSubmission | null = null;

  @ManyToOne({ type: 'EventApprovalStep', nullable: true })
  lastEventApprovalStep: EventApprovalStep | null = null;

  @OneToMany({ type: 'EventApproval', mappedBy: 'event' })
  @TransformCollection()
  eventApprovals = new Collection<EventApproval>(this);

  @OneToMany({ type: 'EventJoin', mappedBy: 'event' })
  @TransformCollection()
  registrations = new Collection<EventJoin>(this);

  constructor(options: TenantEventOptions) {
    super({ ...options, contentMasterKind: ContentMasterKind.TenantEvent });
    this.assign(options);

    this.contentMasterKind = ContentMasterKind.TenantEvent;

    // Event description
    this.rootContent = new Content({
      attachments: [],
      contentMaster: this,
      representingOrg: options.org,
      realAuthor: options.createdBy,
      tenant: options.tenant,
      description: options.description ?? '',
      // TODO: extra props
    });

    this.joinForm.representingOrg = options.org ?? null;
  }
}
