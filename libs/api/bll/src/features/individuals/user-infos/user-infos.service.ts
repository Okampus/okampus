import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserInfoRepository, UserInfo } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class UserInfosService extends RequestContext {
  private readonly logger = new Logger(UserInfosService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly userInfoRepository: UserInfoRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['UserInfoInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(userInfo: UserInfo) {
    if (userInfo.deletedAt) throw new NotFoundException(`UserInfo was deleted on ${userInfo.deletedAt}.`);
    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['UserInfoSetInput'], userInfo: UserInfo) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (userInfo.deletedAt) throw new NotFoundException(`UserInfo was deleted on ${userInfo.deletedAt}.`);
    if (userInfo.hiddenAt) throw new NotFoundException('UserInfo must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return userInfo.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['UserInfoSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['UserInfoInsertInput']) {
    // Custom logic
    return true;
  }

  async insertUserInfoOne(
    selectionSet: string[],
    object: ValueTypes['UserInfoInsertInput'],
    onConflict?: ValueTypes['UserInfoOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert UserInfo.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertUserInfoOne', selectionSet, object, onConflict);

    const userInfo = await this.userInfoRepository.findOneOrFail(data.insertUserInfoOne.id);
    await this.logsService.createLog(EntityName.UserInfo, userInfo);

    // Custom logic
    return data.insertUserInfoOne;
  }

  async findUserInfo(
    selectionSet: string[],
    where: ValueTypes['UserInfoBoolExp'],
    orderBy?: Array<ValueTypes['UserInfoOrderBy']>,
    distinctOn?: Array<ValueTypes['UserInfoSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('userInfo', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.userInfo;
  }

  async findUserInfoByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('userInfoByPk', selectionSet, { id });
    return data.userInfoByPk;
  }

  async insertUserInfo(
    selectionSet: string[],
    objects: Array<ValueTypes['UserInfoInsertInput']>,
    onConflict?: ValueTypes['UserInfoOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert UserInfo.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertUserInfo', selectionSet, objects, onConflict);

    for (const inserted of data.insertUserInfo.returning) {
      const userInfo = await this.userInfoRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.UserInfo, userInfo);
    }

    // Custom logic
    return data.insertUserInfo;
  }

  async updateUserInfoMany(selectionSet: string[], updates: Array<ValueTypes['UserInfoUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const userInfos = await this.userInfoRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const userInfo = userInfos.find((userInfo) => userInfo.id === update.where.id._eq);
      if (!userInfo) throw new NotFoundException(`UserInfo (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, userInfo);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update UserInfo (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateUserInfoMany', selectionSet, updates);

    await Promise.all(
      userInfos.map(async (userInfo) => {
        const update = updates.find((update) => update.where.id._eq === userInfo.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.UserInfo, userInfo, update._set);
      })
    );

    // Custom logic
    return data.updateUserInfoMany;
  }

  async updateUserInfoByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['UserInfoPkColumnsInput'],
    _set: ValueTypes['UserInfoSetInput']
  ) {
    const userInfo = await this.userInfoRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, userInfo);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update UserInfo (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateUserInfoByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.UserInfo, userInfo, _set);

    // Custom logic
    return data.updateUserInfoByPk;
  }

  async deleteUserInfo(selectionSet: string[], where: ValueTypes['UserInfoBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const userInfos = await this.userInfoRepository.findByIds(where.id._in);
    for (const userInfo of userInfos) {
      const canDelete = this.checkPermsDelete(userInfo);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete UserInfo (${userInfo.id}).`);
    }

    const data = await this.hasuraService.update('updateUserInfo', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      userInfos.map(async (userInfo) => {
        await this.logsService.deleteLog(EntityName.UserInfo, userInfo.id);
      })
    );

    // Custom logic
    return data.updateUserInfo;
  }

  async deleteUserInfoByPk(selectionSet: string[], pkColumns: ValueTypes['UserInfoPkColumnsInput']) {
    const userInfo = await this.userInfoRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(userInfo);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete UserInfo (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateUserInfoByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.UserInfo, pkColumns.id);
    // Custom logic
    return data.updateUserInfoByPk;
  }

  async aggregateUserInfo(
    selectionSet: string[],
    where: ValueTypes['UserInfoBoolExp'],
    orderBy?: Array<ValueTypes['UserInfoOrderBy']>,
    distinctOn?: Array<ValueTypes['UserInfoSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'userInfoAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.userInfoAggregate;
  }
}
