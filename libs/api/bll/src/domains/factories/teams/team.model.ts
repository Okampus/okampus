import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IForm, ITeam, ITeamMember } from '@okampus/shared/dtos';
import { OrgKind, TeamType } from '@okampus/shared/enums';
import { Paginated } from '../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { OrgModel } from '../abstract/org.model';
import { FormModel } from '../forms/form.model';
// eslint-disable-next-line import/no-cycle
import { TeamMemberModel } from './team-member.model';

@ObjectType({ implements: () => [OrgModel] })
export class TeamModel extends OrgModel implements ITeam {
  @Field(() => String, { nullable: true })
  tagline!: string | null;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => Int)
  membershipFees!: number;

  @Field(() => Int)
  memberCount!: number;

  @Field(() => FormModel, { nullable: true })
  joinForm?: IForm | null;

  @Field(() => String)
  directorsCategoryName!: string;

  @Field(() => String)
  managersCategoryName!: string;

  @Field(() => String)
  membersCategoryName!: string;

  @Field(() => [TeamMemberModel])
  members!: ITeamMember[];

  constructor(team: ITeam) {
    super(team);
    this.assign(team);

    this.orgKind = OrgKind.Team;
  }
}

@ObjectType()
export class PaginatedTeamModel extends Paginated(TeamModel) {}
