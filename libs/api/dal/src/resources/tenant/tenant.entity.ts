// eslint-disable-next-line import/no-cycle
import { BaseEntity } from '..';

import {
  Cascade,
  Collection,
  Embedded,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { OidcInfo } from '@okampus/shared/dtos';

import type { EventApprovalStep } from './event-approval-step/event-approval-step.entity';
import type { Form } from '../form/form.entity';
import type { Team } from '../team/team.entity';
import type { TenantOptions } from './tenant.options';
import type { Upload } from '../upload/upload';

// TODO: add official locations/addresses
@Entity()
export class Tenant extends BaseEntity {
  @Unique()
  @Property({ type: 'text' })
  domain!: string;

  @Property({ type: 'text' })
  name!: string;

  @Embedded(() => OidcInfo)
  oidcInfo = new OidcInfo({});

  @OneToMany({ type: 'EventApprovalStep', mappedBy: 'tenant' })
  @TransformCollection()
  eventApprovalSteps = new Collection<EventApprovalStep>(this);

  @OneToOne({ type: 'Team', nullable: true, default: null })
  team: Team | null = null;

  @OneToOne({ type: 'Form', nullable: true, default: null, cascade: [Cascade.ALL] })
  eventValidationForm: Form | null = null;

  @ManyToOne({ type: 'Upload', nullable: true, default: null })
  logo: Upload | null = null;

  constructor(options: TenantOptions) {
    super();
    this.assign(options);
  }
}
