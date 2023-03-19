// eslint-disable-next-line import/no-cycle
import { ShortcutModel } from '../../index';
import { UserProfileModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { IndividualModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { TeamMemberModel } from '../../index';
// eslint-disable-next-line import/no-cycle
import { TeamJoinModel } from '../../index';
import { Field, ObjectType } from '@nestjs/graphql';
import { IndividualKind, RoleType, ScopeRole } from '@okampus/shared/enums';

import type { IShortcut, ITeamJoin, ITeamMember, IUser, IUserProfile } from '@okampus/shared/dtos';

@ObjectType({ implements: () => [IndividualModel] })
export class UserModel extends IndividualModel implements IUser {
  // UserProps
  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => [String])
  middleNames!: string[];

  @Field(() => ScopeRole)
  scopeRole!: ScopeRole;

  @Field(() => [RoleType])
  roles!: RoleType[];

  // UserProfile
  @Field(() => UserProfileModel, { nullable: true })
  profile?: IUserProfile;

  @Field(() => [ShortcutModel])
  shortcuts!: IShortcut[];

  @Field(() => [TeamMemberModel])
  teamMemberships!: ITeamMember[];

  @Field(() => [TeamJoinModel])
  teamJoins!: ITeamJoin[];

  constructor(user: Omit<IUser, 'individualKind'>) {
    super({ ...user, individualKind: IndividualKind.User });
    this.assign(user);

    this.individualKind = IndividualKind.User;
  }
}

@ObjectType()
export class PaginatedUserModel extends Paginated(UserModel) {}
