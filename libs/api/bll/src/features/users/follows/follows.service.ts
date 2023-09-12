import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { FollowRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Follow } from '@okampus/api/dal';
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
    private readonly followRepository: FollowRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: FollowInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return false;
  }

  async checkPermsDelete(follow: Follow) {
    if (follow.deletedAt) throw new NotFoundException(`Follow was deleted on ${follow.deletedAt}.`);

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: FollowSetInput, follow: Follow) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (follow.deletedAt) throw new NotFoundException(`Follow was deleted on ${follow.deletedAt}.`);

    // Custom logic
    return follow.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: FollowSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: FollowInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    return true;
  }

  async insertFollowOne(selectionSet: string[], object: FollowInsertInput, onConflict?: FollowOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Follow.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
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
    offset?: number,
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

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
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

    await Promise.all(
      updates.map(async (update) => {
        const follow = follows.find((follow) => follow.id === update.where.id._eq);
        if (!follow) throw new NotFoundException(`Follow (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, follow);
        if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Follow (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateFollowMany', selectionSet, updates);

    await Promise.all(
      follows.map(async (follow) => {
        const update = updates.find((update) => update.where.id._eq === follow.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Follow, follow, update._set);
      }),
    );

    // Custom logic
    return data.updateFollowMany;
  }

  async updateFollowByPk(selectionSet: string[], pkColumns: FollowPkColumnsInput, _set: FollowSetInput) {
    const follow = await this.followRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, follow);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Follow (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
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

    await Promise.all(
      follows.map(async (follow) => {
        const canDelete = await this.checkPermsDelete(follow);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Follow (${follow.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateFollow', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      follows.map(async (follow) => {
        await this.logsService.deleteLog(EntityName.Follow, follow.id);
      }),
    );

    // Custom logic
    return data.updateFollow;
  }

  async deleteFollowByPk(selectionSet: string[], id: string) {
    const follow = await this.followRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(follow);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Follow (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateFollowByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Follow, id);
    // Custom logic
    return data.updateFollowByPk;
  }

  async aggregateFollow(
    selectionSet: string[],
    where: FollowBoolExp,
    orderBy?: Array<FollowOrderBy>,
    distinctOn?: Array<FollowSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'followAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.followAggregate;
  }
}
