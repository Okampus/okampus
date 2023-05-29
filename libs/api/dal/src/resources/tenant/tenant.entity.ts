import { TenantRepository } from './tenant.repository';
// eslint-disable-next-line import/no-cycle
import { BaseEntity } from '..';
import {
  Cascade,
  Collection,
  Embedded,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { OidcInfo } from '@okampus/shared/dtos';

import type { Campus } from './campus/campus.entity';
import type { EventApprovalStep } from './event-approval-step/event-approval-step.entity';
import type { Form } from '../form/form.entity';
import type { TenantOptions } from './tenant.options';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { Team } from '../team/team.entity';

// TODO: add official locations/addresses
@Entity({ customRepository: () => TenantRepository })
export class Tenant extends BaseEntity {
  [EntityRepositoryType]!: TenantRepository;

  @Unique()
  @Property({ type: 'text' })
  domain!: string;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  pointName!: string;

  @Embedded(() => OidcInfo)
  oidcInfo = new OidcInfo({});

  @OneToMany({ type: 'EventApprovalStep', mappedBy: 'tenant' })
  @TransformCollection()
  eventApprovalSteps = new Collection<EventApprovalStep>(this);

  @OneToOne({ type: 'Form', nullable: true, default: null, cascade: [Cascade.ALL] })
  eventValidationForm: Form | null = null;

  @OneToMany({ type: 'Campus', mappedBy: 'tenant' })
  @TransformCollection()
  campus = new Collection<Campus>(this);

  @OneToOne({ type: 'Team', nullable: true, default: null })
  team: Team | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  logo: FileUpload | null = null;

  constructor(options: TenantOptions) {
    super();
    this.assign(options);
  }
}
