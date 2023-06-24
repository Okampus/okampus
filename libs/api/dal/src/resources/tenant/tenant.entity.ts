import { TenantRepository } from './tenant.repository';
// eslint-disable-next-line import/no-cycle
import { BaseEntity } from '..';
import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

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

  @Property({ type: 'boolean', default: true })
  isOidcEnabled = false;

  @Property({ type: 'text', default: '' })
  oidcName = '';

  @Property({ type: 'text', default: '' })
  oidcClientId = '';

  @Property({ type: 'text', default: '', hidden: true })
  oidcClientSecret = '';

  @Property({ type: 'text', default: '' })
  oidcDiscoveryUrl = '';

  @Property({ type: 'text', default: '' })
  oidcScopes = '';

  @Property({ type: 'text', default: '' })
  oidcCallbackUri = '';

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
