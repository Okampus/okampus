import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Individual } from '../../actor/individual/individual.entity';
import { TenantEvent } from '../../content-master/event/event.entity';
import { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';
import { EventApprovalOptions } from './event-approval.options';
// eslint-disable-next-line import/no-cycle
import { EventApprovalRepository } from './event-approval.repository';

@Entity({
  customRepository: () => EventApprovalRepository,
})
export class EventApproval extends TenantScopedEntity {
  @ManyToOne({ type: 'TenantEvent', cascade: [Cascade.ALL] })
  event!: TenantEvent;

  @ManyToOne({ type: 'Individual', cascade: [Cascade.ALL] })
  createdBy!: Individual;

  @Property({ type: 'text', nullable: true })
  message: string | null = null;

  @Property({ type: 'boolean' })
  approved!: boolean;

  @ManyToOne({ type: 'EventApprovalStep', cascade: [Cascade.ALL] })
  step!: EventApprovalStep;

  constructor(options: EventApprovalOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
