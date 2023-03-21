import { EventApprovalRepository } from './event-approval.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Cascade, Entity, ManyToOne, Property } from '@mikro-orm/core';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { EventApprovalStep } from '../event-approval-step/event-approval-step.entity';
import type { EventApprovalOptions } from './event-approval.options';

@Entity({ customRepository: () => EventApprovalRepository })
export class EventApproval extends TenantScopedEntity {
  @ManyToOne({ type: 'TenantEvent', cascade: [Cascade.ALL] })
  event!: TenantEvent;

  @Property({ type: 'text', nullable: true })
  message: string | null = null;

  @Property({ type: 'boolean' })
  approved!: boolean;

  @ManyToOne({ type: 'EventApprovalStep', cascade: [Cascade.ALL] })
  step!: EventApprovalStep;

  constructor(options: EventApprovalOptions) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);
  }
}
