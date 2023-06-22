import { TenantRepository } from './tenant.repository';
// eslint-disable-next-line import/no-cycle
import { BaseEntity } from '..';
import {
  Cascade,
  Collection,
  Embedded,
  Entity,
  EntityRepositoryType,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { OidcInfo } from '@okampus/shared/dtos';

import type { TenantOptions } from './tenant.options';
import type { TenantManage } from './tenant-manage/tenant-manage.entity';
import type { CampusCluster } from './campus-cluster/campus-cluster.entity';
import type { EventApprovalStep } from './event-approval-step/event-approval-step.entity';
import type { Form } from '../form/form.entity';

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

  @OneToMany({ type: 'CampusCluster', mappedBy: 'tenant' })
  @TransformCollection()
  campusClusters = new Collection<CampusCluster>(this);

  @OneToMany({ type: 'TenantManage', mappedBy: 'tenant' })
  @TransformCollection()
  tenantManages = new Collection<TenantManage>(this);

  constructor(options: TenantOptions) {
    super();
    this.assign(options);
  }
}
