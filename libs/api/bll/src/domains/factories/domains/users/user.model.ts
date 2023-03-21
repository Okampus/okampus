// eslint-disable-next-line import/no-cycle
import { IndividualModel, ShortcutModel, TeamJoinModel, TeamMemberModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, ObjectType } from '@nestjs/graphql';
import { IndividualKind, RoleType, ScopeRole } from '@okampus/shared/enums';

import { UserCustomization, UserNotificationSettings, UserSettings, UserStats } from '@okampus/shared/dtos';
import type { IShortcut, ITeamJoin, ITeamMember, IUser } from '@okampus/shared/dtos';

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

  @Field(() => [ShortcutModel])
  shortcuts!: IShortcut[];

  @Field(() => [TeamMemberModel])
  teamMemberships!: ITeamMember[];

  @Field(() => [TeamJoinModel])
  teamJoins!: ITeamJoin[];

  // UserProfile
  @Field(() => UserCustomization)
  customization!: UserCustomization;

  @Field(() => UserStats)
  stats!: UserStats;

  @Field(() => UserSettings)
  settings!: UserSettings;

  @Field(() => UserNotificationSettings)
  notificationSettings!: UserNotificationSettings;

  @Field(() => Boolean)
  finishedIntroduction = false;

  @Field(() => Boolean)
  finishedOnboarding = false;

  constructor(user: Omit<IUser, 'individualKind'>) {
    super({ ...user, individualKind: IndividualKind.User });
    this.assign(user);

    this.individualKind = IndividualKind.User;
  }
}

@ObjectType()
export class PaginatedUserModel extends Paginated(UserModel) {}
