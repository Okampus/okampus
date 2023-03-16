import { IndividualModel } from './individual.model';
import { TenantScopedModel } from './tenant-scoped.model';
import { FormSubmissionModel } from '../domains/forms/form-submission.model';
// eslint-disable-next-line import/no-cycle
import { UserModel } from '../domains/users/user.model';
import { Field, InterfaceType } from '@nestjs/graphql';
import { JoinKind, ApprovalState } from '@okampus/shared/enums';
import type { IFormSubmission, IIndividual, IJoin, IUser } from '@okampus/shared/dtos';

@InterfaceType()
export abstract class JoinModel extends TenantScopedModel implements IJoin {
  @Field(() => JoinKind)
  joinKind!: JoinKind;

  @Field(() => IndividualModel, { nullable: true })
  issuer?: IIndividual | null;

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
