import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { JoinKind } from '@okampus/shared/enums';
import { ApprovalState } from '@okampus/shared/enums';
import type { JoinOptions } from './join.options';
import type { Individual } from '../actor/individual/individual.entity';
import type { FormSubmission } from '../ugc/form-submission/form-submission.entity';
import type { User } from '../actor/user/user.entity';

@Entity({
  discriminatorColumn: 'joinKind',
  discriminatorMap: JoinKind,
  abstract: true,
})
export abstract class Join extends TenantScopedEntity {
  @Enum({ items: () => JoinKind, type: 'string' })
  joinKind!: JoinKind;

  // If issuer is null, the joiner is the issuer and the Join is a request
  // If issuer is not null, the Join is an invitation
  @ManyToOne({ type: 'Individual', nullable: true })
  issuer: Individual | null = null;

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

  @Enum({ items: () => ApprovalState, type: 'string', default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  constructor(options: JoinOptions & { joinKind: JoinKind }) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
