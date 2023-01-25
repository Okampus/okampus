import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ActorImageUploadProps } from '@okampus/api/dal';
import { CreateUserDto, UpdateUserDto } from '@okampus/shared/dtos';
import { UUID } from '@okampus/shared/types';
import { RequestContext } from '../../../shards/global-request/request-context';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { PaginatedUserModel, UserModel } from '../../factories/users/user.model';
import { CreateUserCommand } from './commands/create-user/create-user.command';
import { DeleteUserCommand } from './commands/delete-user/delete-user.command';
import { UpdateUserCommand } from './commands/update-user/update-user.command';
import { GetUserByIdQuery } from './queries/get-user-by-id/get-user-by-id.query';
import { GetUserBySlugQuery } from './queries/get-user-by-slug/get-user-by-slug.query';
import { GetUsersQuery } from './queries/get-users/get-users.query';

const defaultUserPopulate = ['actor', 'actor.images', 'actor.socials'];

@Injectable()
export class UsersService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: UUID): Promise<UserModel> {
    const query = new GetUserByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultUserPopulate));
    return this.queryBus.execute(query);
  }

  findBareById(id: UUID): Promise<UserModel> {
    const query = new GetUserByIdQuery(id, this.tenant());
    return this.queryBus.execute(query);
  }

  findOneBySlug(slug: string): Promise<UserModel> {
    const query = new GetUserBySlugQuery(slug, this.tenant(), this.autoGqlPopulate(defaultUserPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedUserModel> {
    const query = new GetUsersQuery(paginationOptions, this.tenant(), this.autoGqlPopulate(defaultUserPopulate));
    return this.queryBus.execute(query);
  }

  create(createUser: CreateUserDto, actorImages?: ActorImageUploadProps): Promise<UserModel> {
    // TODO: Create an event to send a validation email in some cases
    const command = new CreateUserCommand(createUser, this.tenant(), actorImages);
    return this.commandBus.execute(command);
  }

  update(updateUser: UpdateUserDto): Promise<UserModel> {
    const command = new UpdateUserCommand(updateUser, this.tenant(), this.autoGqlPopulate(defaultUserPopulate));
    return this.commandBus.execute(command);
  }

  delete(id: UUID): Promise<boolean> {
    const command = new DeleteUserCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }

  // async findBare(slugOrEmail: string) {
  //   return this.userRepository.findOneByQuery(slugOrEmail);
  //   // return this.userRepository.findOne({ $or: [{ slug: slugOrEmail }, { primaryEmail: slugOrEmail }] });
  // }

  // async createBare(userInfo: PreRegisterSsoDto, forTenant: string) {
  //   const tenant = await this.tenantRepository.findOne({ tenant: { domain: forTenant } });

  //   if (!tenant) throw new BadRequestException('');

  //   const user = new User({
  //     tenant: tenant.tenant,
  //     slug: userInfo.id,
  //     name: userInfo.firstName + ' ' + userInfo.lastName,
  //     firstName: userInfo.firstName,
  //     lastName: userInfo.lastName,
  //     roles: [Role.User],
  //     scopeRole: ScopeRole.Student,
  //   });

  //   this.userRepository.flush();
  //   return user;
  // }

  // async findById(id: string) {
  //   return this.userRepository.findOne(id);
  // }

  // async findOne(slugOrEmail: string) {
  //   return this.userRepository.findOneByQuery(slugOrEmail);
  // }
}
