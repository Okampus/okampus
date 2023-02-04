import { TenantEventRepository } from './event.repository';
import { ContentMaster } from '../content-master.entity';
import { Content } from '../../ugc/content/content.entity';
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
// import { Paginated } from 'libs/api/dal/src/base/abstract/pagination';
// import { BaseTenant } from '@api/shards/entities/base-tenant.entity';
// import { EventState } from '@api/shards/types/enums/event-state.enum';
// import { EventRegistration } from '@api/plan/registrations/registration.entity';
// import { TeamForm } from '@api/teams/forms/team-form.entity';
// import { TeamMember } from '@api/teams/members/team-member.entity';
// import { Team } from '@api/teams/team.entity';
// import { ApprovalStep } from '@api/tenants/approval-steps/approval-step.entity';
// import { User } from '@api/uaa/users/user.entity';
// import { CreateEventDto } from './dto/create-event.dto';
import { EventState } from '@okampus/shared/enums';
import { ContentMasterKind } from '@okampus/shared/enums';
import { Address } from '@okampus/shared/dtos';
import { TransformCollection } from '@okampus/api/shards';
import type { JSONObject } from '@okampus/shared/types';
import type { TenantEventOptions } from './event.options';
import type { EventApprovalStep } from '../../manage-tenant/event-approval-step/event-approval-step.entity';
import type { EventJoin } from '../../join/event-join/event-join.entity';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import type { User } from '../../actor/user/user.entity';
import type { Form } from '../../ugc/form/form.entity';
import type { FormSubmission } from '../../ugc/form-submission/form-submission.entity';
import type { EventApproval } from '../../manage-tenant/event-approval/event-approval.entity';


@Entity({
  customRepository: () => TenantEventRepository,
}) // Called "TenantEvent" to avoid name collision with native JS "Event"
export class TenantEvent extends ContentMaster {
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

  @Enum(() => EventState)
  state!: EventState;

  @Property({ type: 'json' })
  meta: JSONObject = {};

  @ManyToOne({ type: 'User' })
  supervisor!: User;

  @Property({ type: 'boolean' })
  @Index()
  private = false;

  @OneToOne({ type: 'Form', nullable: true, cascade: [Cascade.ALL] })
  joinForm: Form | null = null;

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
      contentMaster: this,
      representingOrg: options.org,
      realAuthor: options.createdBy,
      tenant: options.tenant,
      text: options.description ?? '',
      // TODO: extra props
    });
  }
}
