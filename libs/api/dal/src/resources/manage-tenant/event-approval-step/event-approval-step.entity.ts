import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { EventApprovalStepOptions } from './event-approval-step.options';
import { Individual } from '../../actor/individual/individual.entity';
import { User } from '../../actor/user/user.entity';
import type { Tenant } from '../../org/tenant/tenant.entity';
// eslint-disable-next-line import/no-cycle
import { EventApprovalStepRepository } from './event-approval-step.repository';

@Entity({
  customRepository: () => EventApprovalStepRepository,
})
export class EventApprovalStep extends TenantScopedEntity {
  @ManyToOne({ type: 'Tenant' })
  tenantOrg!: Tenant;

  @ManyToOne({ type: 'Individual', nullable: true })
  createdBy: Individual | null = null; // add null as system

  @Property()
  order!: number;

  @Property()
  name!: string;

  @ManyToMany({ type: 'Individual', cascade: [Cascade.ALL] })
  @TransformCollection()
  validators = new Collection<Individual>(this);

  @ManyToMany({ type: 'User', cascade: [Cascade.ALL] })
  @TransformCollection()
  notifiees = new Collection<User>(this);

  constructor(options: EventApprovalStepOptions) {
    super(options);
    this.assign(options);
  }
}
