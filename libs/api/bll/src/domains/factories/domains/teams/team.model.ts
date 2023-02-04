import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import type { IFinance, IForm, ITeam, ITeamCategory, ITeamMember } from '@okampus/shared/dtos';
import { OrgKind, TeamType } from '@okampus/shared/enums';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { OrgModel } from '../../abstract/org.model';
import { FormModel } from '../forms/form.model';
// eslint-disable-next-line import/no-cycle
import { TeamRoleModel } from '../roles/team-role.model';
// eslint-disable-next-line import/no-cycle
import { TeamCategoryModel } from '../tags/team-category.model';
// eslint-disable-next-line import/no-cycle
import { FinanceModel } from './finance.model';
// eslint-disable-next-line import/no-cycle
import { TeamMemberModel } from './team-member.model';

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

  @Field(() => FormModel, { nullable: true })
  joinForm?: IForm | null;

  @Field(() => [TeamMemberModel])
  members!: ITeamMember[];

  @Field(() => [TeamRoleModel])
  roles!: TeamRoleModel[];

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
