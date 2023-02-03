import { Field, ObjectType } from '@nestjs/graphql';
import { IShortcut, IUser, IUserProfile } from '@okampus/shared/dtos';
import { IndividualKind, RoleType, ScopeRole } from '@okampus/shared/enums';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { IndividualModel } from '../../abstract/individual.model';
// eslint-disable-next-line import/no-cycle
import { ShortcutModel } from './shortcut.model';
import { UserProfileModel } from './user-profile.model';

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

  constructor(user: Omit<IUser, 'individualKind'>) {
    super({ ...user, individualKind: IndividualKind.User });
    this.assign(user);

    this.individualKind = IndividualKind.User;
  }
}

@ObjectType()
export class PaginatedUserModel extends Paginated(UserModel) {}
