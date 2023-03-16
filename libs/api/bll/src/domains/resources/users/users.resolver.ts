// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UsersService } from './users.service';
import { UserFilterQuery } from './user.filter-query';
import { PaginatedUserModel, UserModel } from '../../factories/domains/users/user.model';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { ActorImageModel } from '../../factories/domains/images/actor-image.model';

import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { ActorImageType } from '@okampus/shared/enums';
import { CreateUserDto } from '@okampus/shared/dtos';
import { UpdateUserDto } from '@okampus/shared/dtos';

import type { MulterFileType, Snowflake } from '@okampus/shared/types';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserModel)
  userById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.usersService.findOneById(id);
  }

  @Query(() => UserModel)
  userBySlug(@Args('slug') slug: string) {
    return this.usersService.findOneBySlug(slug);
  }

  @Query(() => PaginatedUserModel)
  users(
    @Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions,
    @Args('filter', { type: () => UserFilterQuery, nullable: true }) filter: UserFilterQuery
  ) {
    // eslint-disable-next-line unicorn/no-array-method-this-argument
    return this.usersService.find(options, filter);
  }

  @Mutation(() => UserModel)
  createUser(
    @Args('user', { type: () => CreateUserDto }) user: CreateUserDto,
    @Args('avatar', { type: () => GraphQLUpload, nullable: true }) avatar?: MulterFileType,
    @Args('avatarDark', { type: () => GraphQLUpload, nullable: true }) avatarDark?: MulterFileType,
    @Args('banner', { type: () => GraphQLUpload, nullable: true }) banner?: MulterFileType
  ) {
    return this.usersService.create(user, {
      [ActorImageType.Avatar]: avatar,
      [ActorImageType.AvatarDarkMode]: avatarDark,
      [ActorImageType.Banner]: banner,
    });
  }

  @Mutation(() => ActorImageModel)
  deactivateUserImage(
    @Args('id', { type: () => String }) id: Snowflake,
    @Args('actorImageType', { type: () => ActorImageType }) actorImageType: ActorImageType
  ) {
    return this.usersService.deactivateUserImage(id, actorImageType);
  }

  @Mutation(() => UserModel)
  updateUser(
    @Args('updateUser', { type: () => UpdateUserDto }) updateUser: UpdateUserDto,
    @Args('avatar', { type: () => GraphQLUpload, nullable: true }) avatar?: MulterFileType,
    @Args('avatarDark', { type: () => GraphQLUpload, nullable: true }) avatarDark?: MulterFileType,
    @Args('banner', { type: () => GraphQLUpload, nullable: true }) banner?: MulterFileType
  ) {
    return this.usersService.update(updateUser, {
      [ActorImageType.Avatar]: avatar,
      [ActorImageType.AvatarDarkMode]: avatarDark,
      [ActorImageType.Banner]: banner,
    });
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('id', { type: () => String }) id: Snowflake) {
    return this.usersService.delete(id);
  }
}
