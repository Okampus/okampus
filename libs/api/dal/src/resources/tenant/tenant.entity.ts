import { TenantRepository } from './tenant.repository';
// eslint-disable-next-line import/no-cycle
import { BaseEntity } from '..';
import { Actor } from '../actor/actor.entity';
import { Collection, Entity, EntityRepositoryType, OneToMany, OneToOne, Property, Unique } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import type { TenantOptions } from './tenant.options';
import type { TenantRole } from './tenant-role/tenant-role.entity';
import type { AdminRole } from './admin-role/admin-role.entity';
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
  pointName!: string;

  @Property({ type: 'boolean', default: true })
  isOidcEnabled = false;

  @Unique()
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

  @OneToMany({ type: 'EventApprovalStep', mappedBy: 'tenantScope' })
  @TransformCollection()
  eventApprovalSteps = new Collection<EventApprovalStep>(this);

  @OneToOne({ type: 'Form', nullable: true, default: null })
  eventValidationForm: Form | null = null;

  @OneToOne({ type: 'Actor', inversedBy: 'tenant' })
  actor: Actor;

  @OneToMany({ type: 'CampusCluster', mappedBy: 'tenantScope' })
  @TransformCollection()
  campusClusters = new Collection<CampusCluster>(this);

  @OneToMany({ type: 'AdminRole', mappedBy: 'tenant' })
  @TransformCollection()
  adminRoles = new Collection<AdminRole>(this);

  @OneToMany({ type: 'TenantRole', mappedBy: 'tenantScope' })
  @TransformCollection()
  tenantRoles = new Collection<TenantRole>(this);

  constructor(options: TenantOptions) {
    super();
    this.assign(options);

    this.actor = new Actor({
      name: options.name,
      bio: options.bio,
      email: options.email,
      status: options.status,
      createdBy: null,
      tenant: this,
      tenantScope: this,
    });
  }
}
