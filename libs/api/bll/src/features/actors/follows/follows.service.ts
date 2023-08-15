import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { FollowRepository, Follow } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  FollowInsertInput,
  FollowOnConflict,
  FollowBoolExp,
  FollowOrderBy,
  FollowSelectColumn,
  FollowSetInput,
  FollowUpdates,
  FollowPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class FollowsService extends RequestContext {
  private readonly logger = new Logger(FollowsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly followRepository: FollowRepository
  ) {
    super();
  }

  checkPermsCreate(props: FollowInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(follow: Follow) {
    if (follow.deletedAt) throw new NotFoundException(`Follow was deleted on ${follow.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === follow.tenant?.id
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: FollowSetInput, follow: Follow) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (follow.deletedAt) throw new NotFoundException(`Follow was deleted on ${follow.deletedAt}.`);
    if (follow.hiddenAt) throw new NotFoundException('Follow must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === follow.tenant?.id
        )
    )
      return true;

    // Custom logic
    return follow.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: FollowSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: FollowInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertFollowOne(selectionSet: string[], object: FollowInsertInput, onConflict?: FollowOnConflict) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Follow.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertFollowOne', selectionSet, object, onConflict);

    const follow = await this.followRepository.findOneOrFail(data.insertFollowOne.id);
    await this.logsService.createLog(EntityName.Follow, follow);

    // Custom logic
    return data.insertFollowOne;
  }

  async findFollow(
    selectionSet: string[],
    where: FollowBoolExp,
    orderBy?: Array<FollowOrderBy>,
    distinctOn?: Array<FollowSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('follow', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.follow;
  }

  async findFollowByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('followByPk', selectionSet, { id });
    return data.followByPk;
  }

  async insertFollow(selectionSet: string[], objects: Array<FollowInsertInput>, onConflict?: FollowOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Follow.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertFollow', selectionSet, objects, onConflict);

    for (const inserted of data.insertFollow.returning) {
      const follow = await this.followRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Follow, follow);
    }

    // Custom logic
    return data.insertFollow;
  }

  async updateFollowMany(selectionSet: string[], updates: Array<FollowUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const follows = await this.followRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const follow = follows.find((follow) => follow.id === update.where.id._eq);
      if (!follow) throw new NotFoundException(`Follow (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, follow);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Follow (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateFollowMany', selectionSet, updates);

    await Promise.all(
      follows.map(async (follow) => {
        const update = updates.find((update) => update.where.id._eq === follow.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Follow, follow, update._set);
      })
    );

    // Custom logic
    return data.updateFollowMany;
  }

  async updateFollowByPk(selectionSet: string[], pkColumns: FollowPkColumnsInput, _set: FollowSetInput) {
    const follow = await this.followRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, follow);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Follow (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateFollowByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Follow, follow, _set);

    // Custom logic
    return data.updateFollowByPk;
  }

  async deleteFollow(selectionSet: string[], where: FollowBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const follows = await this.followRepository.findByIds(where.id._in);
    for (const follow of follows) {
      const canDelete = this.checkPermsDelete(follow);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Follow (${follow.id}).`);
    }

    const data = await this.hasuraService.update('updateFollow', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      follows.map(async (follow) => {
        await this.logsService.deleteLog(EntityName.Follow, follow.id);
      })
    );

    // Custom logic
    return data.updateFollow;
  }

  async deleteFollowByPk(selectionSet: string[], pkColumns: FollowPkColumnsInput) {
    const follow = await this.followRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(follow);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Follow (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateFollowByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Follow, pkColumns.id);
    // Custom logic
    return data.updateFollowByPk;
  }

  async aggregateFollow(
    selectionSet: string[],
    where: FollowBoolExp,
    orderBy?: Array<FollowOrderBy>,
    distinctOn?: Array<FollowSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'followAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.followAggregate;
  }
}
