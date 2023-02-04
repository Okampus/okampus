import { PaginatedUserModel, UserModel } from '../../factories/domains/users/user.model';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { ActorImageType } from '@okampus/shared/enums';
import type { UsersService } from './users.service';
import type { CreateUserDto, UpdateUserDto } from '@okampus/shared/dtos';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
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
  users(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.usersService.find(options);
  }

  @Mutation(() => UserModel)
  createUser(
    @Args('user') user: CreateUserDto,
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

  @Mutation(() => UserModel)
  updateUser(@Args('updateUser') updateUser: UpdateUserDto) {
    return this.usersService.update(updateUser);
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('id', { type: () => String }) id: Snowflake) {
    return this.usersService.delete(id);
  }
}
