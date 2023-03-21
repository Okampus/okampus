import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { JoinKind } from '@okampus/shared/enums';
import { ApprovalState } from '@okampus/shared/enums';
import type { JoinOptions } from './join.options';
import type { Individual } from '../actor/individual/individual.entity';
import type { FormSubmission } from '../ugc/form-submission/form-submission.entity';
import type { User } from '../actor/user/user.entity';

@Entity({ discriminatorColumn: 'joinKind', discriminatorMap: JoinKind, abstract: true })
export abstract class Join extends TenantScopedEntity {
  @Enum({ items: () => JoinKind, type: 'string' })
  joinKind!: JoinKind;

  @Enum({ items: () => ApprovalState, type: 'string', default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @ManyToOne({ type: 'User' })
  joiner!: User;

  @ManyToOne({ type: 'Individual', nullable: true })
  settledBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true })
  settledAt: Date | null = null;

  @Property({ type: 'text', nullable: true })
  settledMessage: string | null = null;

  @ManyToOne({ type: 'FormSubmission' })
  formSubmission!: FormSubmission;

  constructor(options: JoinOptions & { joinKind: JoinKind }) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);
  }
}
