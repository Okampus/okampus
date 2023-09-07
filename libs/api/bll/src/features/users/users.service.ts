import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { UserRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { User } from '@okampus/api/dal';
import type {
  UserInsertInput,
  UserOnConflict,
  UserBoolExp,
  UserOrderBy,
  UserSelectColumn,
  UserSetInput,
  UserUpdates,
  UserPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class UsersService extends RequestContext {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: UserInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(user: User) {
    if (user.deletedAt) throw new NotFoundException(`User was deleted on ${user.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canDeleteTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: UserSetInput, user: User) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (user.deletedAt) throw new NotFoundException(`User was deleted on ${user.deletedAt}.`);
    if (user.hiddenAt) throw new NotFoundException('User must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return user.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: UserSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: UserInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertUserOne(selectionSet: string[], object: UserInsertInput, onConflict?: UserOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert User.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertUserOne', selectionSet, object, onConflict);

    const user = await this.userRepository.findOneOrFail(data.insertUserOne.id);
    await this.logsService.createLog(EntityName.User, user);

    // Custom logic
    return data.insertUserOne;
  }

  async findUser(
    selectionSet: string[],
    where: UserBoolExp,
    orderBy?: Array<UserOrderBy>,
    distinctOn?: Array<UserSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('user', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.user;
  }

  async findUserByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('userByPk', selectionSet, { id });
    return data.userByPk;
  }

  async insertUser(selectionSet: string[], objects: Array<UserInsertInput>, onConflict?: UserOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert User.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertUser', selectionSet, objects, onConflict);

    for (const inserted of data.insertUser.returning) {
      const user = await this.userRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.User, user);
    }

    // Custom logic
    return data.insertUser;
  }

  async updateUserMany(selectionSet: string[], updates: Array<UserUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const users = await this.userRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const user = users.find((user) => user.id === update.where.id._eq);
        if (!user) throw new NotFoundException(`User (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, user);
        if (!canUpdate) throw new ForbiddenException(`You are not allowed to update User (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateUserMany', selectionSet, updates);

    await Promise.all(
      users.map(async (user) => {
        const update = updates.find((update) => update.where.id._eq === user.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.User, user, update._set);
      }),
    );

    // Custom logic
    return data.updateUserMany;
  }

  async updateUserByPk(selectionSet: string[], pkColumns: UserPkColumnsInput, _set: UserSetInput) {
    const user = await this.userRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, user);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update User (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateUserByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.User, user, _set);

    // Custom logic
    return data.updateUserByPk;
  }

  async deleteUser(selectionSet: string[], where: UserBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const users = await this.userRepository.findByIds(where.id._in);

    await Promise.all(
      users.map(async (user) => {
        const canDelete = await this.checkPermsDelete(user);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete User (${user.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateUser', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      users.map(async (user) => {
        await this.logsService.deleteLog(EntityName.User, user.id);
      }),
    );

    // Custom logic
    return data.updateUser;
  }

  async deleteUserByPk(selectionSet: string[], id: string) {
    const user = await this.userRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(user);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete User (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateUserByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.User, id);
    // Custom logic
    return data.updateUserByPk;
  }

  async aggregateUser(
    selectionSet: string[],
    where: UserBoolExp,
    orderBy?: Array<UserOrderBy>,
    distinctOn?: Array<UserSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'userAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.userAggregate;
  }
}
