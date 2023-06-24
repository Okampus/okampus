import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserRepository, User } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class UsersService extends RequestContext {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly userRepository: UserRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['UserInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(user: User) {
    if (user.deletedAt) throw new NotFoundException(`User was deleted on ${user.deletedAt}.`);
    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['UserSetInput'], user: User) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (user.deletedAt) throw new NotFoundException(`User was deleted on ${user.deletedAt}.`);
    if (user.hiddenAt) throw new NotFoundException('User must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return user.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['UserSetInput']) {
    this.hasuraService.checkForbiddenFields(props);
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['UserInsertInput']) {
    // Custom logic

    return true;
  }

  async insertUserOne(
    selectionSet: string[],
    object: ValueTypes['UserInsertInput'],
    onConflict?: ValueTypes['UserOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert User.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertUserOne', selectionSet, object, onConflict);

    const user = await this.userRepository.findOneOrFail(data.insertUserOne.id);
    await this.logsService.createLog(EntityName.User, user);

    // Custom logic
    return data.insertUserOne;
  }

  async findUser(
    selectionSet: string[],
    where: ValueTypes['UserBoolExp'],
    orderBy?: Array<ValueTypes['UserOrderBy']>,
    distinctOn?: Array<ValueTypes['UserSelectColumn']>,
    limit?: number,
    offset?: number
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

  async insertUser(
    selectionSet: string[],
    objects: Array<ValueTypes['UserInsertInput']>,
    onConflict?: ValueTypes['UserOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert User.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertUser', selectionSet, objects, onConflict);

    for (const inserted of data.insertUser.returning) {
      const user = await this.userRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.User, user);
    }

    // Custom logic
    return data.insertUser;
  }

  async updateUserMany(selectionSet: string[], updates: Array<ValueTypes['UserUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const users = await this.userRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const user = users.find((user) => user.id === update.where.id._eq);
      if (!user) throw new NotFoundException(`User (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, user);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update User (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateUserMany', selectionSet, updates);

    await Promise.all(
      users.map(async (user) => {
        const update = updates.find((update) => update.where.id._eq === user.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.User, user, update._set);
      })
    );

    // Custom logic
    return data.updateUserMany;
  }

  async updateUserByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['UserPkColumnsInput'],
    _set: ValueTypes['UserSetInput']
  ) {
    const user = await this.userRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, user);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update User (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateUserByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.User, user, _set);

    // Custom logic
    return data.updateUserByPk;
  }

  async deleteUser(selectionSet: string[], where: ValueTypes['UserBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const users = await this.userRepository.findByIds(where.id._in);
    for (const user of users) {
      const canDelete = this.checkPermsDelete(user);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete User (${user.id}).`);
    }

    const data = await this.hasuraService.update('updateUser', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      users.map(async (user) => {
        await this.logsService.deleteLog(EntityName.User, user.id);
      })
    );

    // Custom logic
    return data.updateUser;
  }

  async deleteUserByPk(selectionSet: string[], pkColumns: ValueTypes['UserPkColumnsInput']) {
    const user = await this.userRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(user);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete User (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateUserByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.User, pkColumns.id);
    // Custom logic
    return data.updateUserByPk;
  }

  async aggregateUser(
    selectionSet: string[],
    where: ValueTypes['UserBoolExp'],
    orderBy?: Array<ValueTypes['UserOrderBy']>,
    distinctOn?: Array<ValueTypes['UserSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'userAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.userAggregate;
  }
}
