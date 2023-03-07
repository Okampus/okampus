import { CreateUserCommand } from './commands/create-user/create-user.command';
import { DeleteUserCommand } from './commands/delete-user/delete-user.command';
import { UpdateUserCommand } from './commands/update-user/update-user.command';
import { GetUserByIdQuery } from './queries/get-user-by-id/get-user-by-id.query';
import { GetUserBySlugQuery } from './queries/get-user-by-slug/get-user-by-slug.query';
import { GetUsersQuery } from './queries/get-users/get-users.query';
import { DeactivateUserImageCommand } from './commands/deactivate-user-image/deactivate-user-image.command';
import { RequestContext } from '../../../shards/abstract/request-context';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import type { UserFilterQuery } from './user.filter-query';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { PaginatedUserModel, UserModel } from '../../factories/domains/users/user.model';
import type { ActorImageUploadProps } from '@okampus/api/dal';
import type { CreateUserDto, UpdateUserDto } from '@okampus/shared/dtos';
import type { ActorImageType } from '@okampus/shared/enums';
import type { Snowflake } from '@okampus/shared/types';

const defaultUserPopulate = ['actor', 'actor.images', 'actor.socials'];

@Injectable()
export class UsersService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<UserModel> {
    const query = new GetUserByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultUserPopulate));
    return this.queryBus.execute(query);
  }

  findBareById(id: Snowflake): Promise<UserModel> {
    const query = new GetUserByIdQuery(id, this.tenant());
    return this.queryBus.execute(query);
  }

  findOneBySlug(slug: string): Promise<UserModel> {
    const query = new GetUserBySlugQuery(slug, this.tenant(), this.autoGqlPopulate(defaultUserPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions, filterQuery: UserFilterQuery): Promise<PaginatedUserModel> {
    const query = new GetUsersQuery(
      filterQuery,
      paginationOptions,
      this.tenant(),
      this.autoGqlPopulate(defaultUserPopulate)
    );
    return this.queryBus.execute(query);
  }

  create(createUser: CreateUserDto, actorImages?: ActorImageUploadProps): Promise<UserModel> {
    // TODO: Create an event to send a validation email in some cases
    const command = new CreateUserCommand(createUser, this.tenant(), actorImages);
    return this.commandBus.execute(command);
  }

  deactivateUserImage(id: Snowflake, actorImageType: ActorImageType) {
    const command = new DeactivateUserImageCommand(
      id,
      actorImageType,
      this.requester(),
      this.tenant(),
      this.autoGqlPopulate()
    );
    return this.commandBus.execute(command);
  }

  update(updateUser: UpdateUserDto, actorImages?: ActorImageUploadProps): Promise<UserModel> {
    const command = new UpdateUserCommand(
      updateUser,
      this.tenant(),
      this.autoGqlPopulate(defaultUserPopulate),
      actorImages
    );
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake): Promise<boolean> {
    const command = new DeleteUserCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }

  // TODO: reimplement this
  // async findBare(slugOrEmail: string) {
  //   return this.userRepository.findOneByQuery(slugOrEmail);
  //   // return this.userRepository.findOne({ $or: [{ slug: slugOrEmail }, { primaryEmail: slugOrEmail }] });
  // }

  // async findById(id: string) {
  //   return this.userRepository.findOne(id);
  // }

  // async findOne(slugOrEmail: string) {
  //   return this.userRepository.findOneByQuery(slugOrEmail);
  // }
}
