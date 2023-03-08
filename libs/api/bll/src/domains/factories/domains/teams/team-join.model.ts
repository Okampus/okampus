// eslint-disable-next-line import/no-cycle
import { TeamModel } from './team.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { UserModel } from '../users/user.model';
import { IndividualModel } from '../../abstract/individual.model';
import { FormSubmissionModel } from '../forms/form-submission.model';
import { TeamRoleModel } from '../roles/team-role.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { JoinKind, JoinState } from '@okampus/shared/enums';

import type { IFormSubmission, IIndividual, ITeam, ITeamJoin, ITeamRole, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class TeamJoinModel extends TenantScopedModel implements ITeamJoin {
  @Field(() => TeamModel)
  team!: ITeam;

  @Field(() => TeamRoleModel)
  askedRole!: ITeamRole;

  @Field(() => TeamRoleModel, { nullable: true })
  receivedRole: ITeamRole | null = null;

  @Field(() => JoinKind)
  joinKind!: JoinKind;

  // If issuer is null, the joiner is the issuer and the Join is a request
  // If issuer is not null, the Join is an invitation
  @Field(() => IndividualModel, { nullable: true })
  issuer: IIndividual | null = null;

  @Field(() => UserModel)
  joiner!: IUser;

  @Field(() => IndividualModel, { nullable: true })
  validatedBy: IIndividual | null = null;

  @Field(() => Date, { nullable: true })
  validatedAt: Date | null = null;

  @Field(() => String, { nullable: true })
  validationMessage: string | null = null;

  @Field(() => FormSubmissionModel, { nullable: true })
  formSubmission: IFormSubmission | null = null;

  @Field(() => JoinState)
  state = JoinState.Pending;

  constructor(teamJoin: ITeamJoin) {
    if (!teamJoin.tenant) throw new Error('TeamJoin must have a tenant');
    super(teamJoin.tenant);
    this.assign(teamJoin);
  }
}

@ObjectType()
export class PaginatedTeamJoinModel extends Paginated(TeamJoinModel) {}
