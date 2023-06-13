import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserInfoRepository, UserInfo } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class UserInfosService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly userInfoRepository: UserInfoRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['UserInfoInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const userInfo = await this.userInfoRepository.findOneOrFail(id);
    if (userInfo.deletedAt) throw new NotFoundException(`UserInfo was deleted on ${userInfo.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['UserInfoSetInput'], userInfo: UserInfo) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (userInfo.deletedAt) throw new NotFoundException(`UserInfo was deleted on ${userInfo.deletedAt}.`);
    if (userInfo.hiddenAt) throw new NotFoundException('UserInfo must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return userInfo.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['UserInfoSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['UserInfoInsertInput']) {
    // Custom logic
    return true;
  }

  async insertUserInfo(
    selectionSet: string[],
    objects: Array<ValueTypes['UserInfoInsertInput']>,
    onConflict?: ValueTypes['UserInfoOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert UserInfo.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert UserInfo.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertUserInfo', selectionSet, objects, onConflict, insertOne);

    for (const inserted of data.insertUserInfo.returning) {
      const userInfo = await this.userInfoRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.UserInfo, userInfo);
    }

    // Custom logic
    return data.insertUserInfo;
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

  async updateUserInfoByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['UserInfoPkColumnsInput'],
    _set: ValueTypes['UserInfoSetInput']
  ) {
    const userInfo = await this.userInfoRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, userInfo);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update UserInfo (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateUserInfoByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.UserInfo, userInfo, _set);

    // Custom logic
    return data.updateUserInfoByPk;
  }

  async deleteUserInfoByPk(selectionSet: string[], pkColumns: ValueTypes['UserInfoPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
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
