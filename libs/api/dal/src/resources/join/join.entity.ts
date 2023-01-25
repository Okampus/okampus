import { Entity, Enum, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { JoinKind } from '@okampus/shared/enums';
import { JoinState } from '@okampus/shared/enums';
import { JoinOptions } from './join.options';
import { Individual } from '../actor/individual/individual.entity';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { FormSubmission } from '../ugc/form-submission/form-submission.entity';
import { User } from '../actor/user/user.entity';

@Entity({
  discriminatorColumn: 'joinKind',
  discriminatorMap: JoinKind,
  abstract: true,
})
export abstract class Join extends TenantScopedEntity {
  @Enum(() => JoinKind)
  joinKind!: JoinKind;

  // If issuer is null, the joiner is the issuer and the Join is a request
  // If issuer is not null, the Join is an invitation
  @OneToOne({ type: 'Individual', nullable: true })
  issuer: Individual | null = null;

  @OneToOne({ type: 'User' })
  joiner!: User;

  @OneToOne({ type: 'Individual', nullable: true })
  validatedBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true })
  validatedAt: Date | null = null;

  @Property({ type: 'text', nullable: true })
  validationMessage: string | null = null;

  @ManyToOne({ type: 'FormSubmission', nullable: true })
  formSubmission: FormSubmission | null = null;

  @Enum(() => JoinState)
  state = JoinState.Pending;

  constructor(options: JoinOptions & { joinKind: JoinKind }) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
