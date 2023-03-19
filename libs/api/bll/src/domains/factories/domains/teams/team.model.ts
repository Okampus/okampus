// eslint-disable-next-line import/no-cycle
import { FinanceModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { TeamMemberModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { TeamJoinModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { TeamRoleModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { TeamCategoryModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { OrgModel } from '../../index';
import { FormModel } from '../../index';
import { OrgKind, TeamType } from '@okampus/shared/enums';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import type { IFinance, IForm, ITeam, ITeamCategory, ITeamJoin, ITeamMember, ITeamRole } from '@okampus/shared/dtos';

@ObjectType({ implements: () => [OrgModel] })
export class TeamModel extends OrgModel implements ITeam {
  @Field(() => String, { nullable: true })
  tagline!: string | null;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => Float)
  membershipFees!: number;

  @Field(() => Float)
  currentFinance!: number;

  @Field(() => Int)
  memberCount!: number;

  @Field(() => String)
  directorsCategoryName!: string;

  @Field(() => String)
  managersCategoryName!: string;

  @Field(() => String)
  membersCategoryName!: string;

  @Field(() => FormModel)
  joinForm!: IForm;

  @Field(() => [TeamMemberModel])
  members!: ITeamMember[];

  @Field(() => [TeamRoleModel])
  roles!: ITeamRole[];

  @Field(() => [TeamJoinModel])
  joins!: ITeamJoin[];

  @Field(() => [TeamCategoryModel])
  categories!: ITeamCategory[];

  @Field(() => [FinanceModel])
  finances!: IFinance[];

  constructor(team: ITeam) {
    super(team);
    this.assign(team);

    this.orgKind = OrgKind.Team;
  }
}

@ObjectType()
export class PaginatedTeamModel extends Paginated(TeamModel) {}
