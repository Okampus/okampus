import { Field, InterfaceType } from '@nestjs/graphql';
import type { IFormSubmission, IIndividual, IJoin, ITenantCore, IUser } from '@okampus/shared/dtos';
import { JoinKind, JoinState } from '@okampus/shared/enums';
import { FormSubmissionModel } from '../domains/forms/form-submission.model';
import { UserModel } from '../domains/users/user.model';
// eslint-disable-next-line import/no-cycle
import { IndividualModel } from './individual.model';
import { TenantScopedModel } from './tenant-scoped.model';

@InterfaceType()
export abstract class JoinModel extends TenantScopedModel implements IJoin {
  @Field(() => JoinKind)
  joinKind!: JoinKind;

  @Field(() => IndividualModel, { nullable: true })
  issuer?: IIndividual | null;

  @Field(() => UserModel, { nullable: true })
  joiner?: IUser;

  @Field(() => IndividualModel, { nullable: true })
  validatedBy?: IIndividual | null;

  @Field(() => Date, { nullable: true })
  validatedAt!: Date | null;

  @Field(() => String, { nullable: true })
  validationMessage!: string | null;

  @Field(() => FormSubmissionModel, { nullable: true })
  formSubmission?: IFormSubmission | null;

  @Field(() => JoinState)
  state!: JoinState;

  constructor(join: IJoin) {
    super(join.tenant as ITenantCore);
    this.assign(join);
  }
}
