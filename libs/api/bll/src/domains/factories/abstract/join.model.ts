/* eslint-disable import/no-cycle */
import { IndividualModel } from '../index';
import { TenantScopedModel } from '../index';
import { FormSubmissionModel } from '../index';
import { UserModel } from '../index';
import { Field, InterfaceType } from '@nestjs/graphql';
import { JoinKind, ApprovalState } from '@okampus/shared/enums';
import type { IFormSubmission, IIndividual, IJoin, IUser } from '@okampus/shared/dtos';

@InterfaceType()
export abstract class JoinModel extends TenantScopedModel implements IJoin {
  @Field(() => JoinKind)
  joinKind!: JoinKind;

  @Field(() => UserModel)
  joiner!: IUser;

  @Field(() => IndividualModel, { nullable: true })
  settledBy?: IIndividual | null;

  @Field(() => Date, { nullable: true })
  settledAt!: Date | null;

  @Field(() => String, { nullable: true })
  settledMessage!: string | null;

  @Field(() => FormSubmissionModel)
  formSubmission!: IFormSubmission;

  @Field(() => ApprovalState)
  state!: ApprovalState;

  constructor(join: IJoin) {
    if (!join.tenant) throw new Error('Join must have a tenant');
    super(join.tenant);
    this.assign(join);
  }
}
