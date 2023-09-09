import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { ActorTagRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { ActorTag } from '@okampus/api/dal';
import type {
  ActorTagInsertInput,
  ActorTagOnConflict,
  ActorTagBoolExp,
  ActorTagOrderBy,
  ActorTagSelectColumn,
  ActorTagSetInput,
  ActorTagUpdates,
  ActorTagPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class ActorTagsService extends RequestContext {
  private readonly logger = new Logger(ActorTagsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly actorTagRepository: ActorTagRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: ActorTagInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return false;
  }

  async checkPermsDelete(actorTag: ActorTag) {
    if (actorTag.deletedAt) throw new NotFoundException(`ActorTag was deleted on ${actorTag.deletedAt}.`);

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ActorTagSetInput, actorTag: ActorTag) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (actorTag.deletedAt) throw new NotFoundException(`ActorTag was deleted on ${actorTag.deletedAt}.`);

    // Custom logic
    return actorTag.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ActorTagSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ActorTagInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    return true;
  }

  async insertActorTagOne(selectionSet: string[], object: ActorTagInsertInput, onConflict?: ActorTagOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert ActorTag.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertActorTagOne', selectionSet, object, onConflict);

    const actorTag = await this.actorTagRepository.findOneOrFail(data.insertActorTagOne.id);
    await this.logsService.createLog(EntityName.ActorTag, actorTag);

    // Custom logic
    return data.insertActorTagOne;
  }

  async findActorTag(
    selectionSet: string[],
    where: ActorTagBoolExp,
    orderBy?: Array<ActorTagOrderBy>,
    distinctOn?: Array<ActorTagSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('actorTag', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.actorTag;
  }

  async findActorTagByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('actorTagByPk', selectionSet, { id });
    return data.actorTagByPk;
  }

  async insertActorTag(selectionSet: string[], objects: Array<ActorTagInsertInput>, onConflict?: ActorTagOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert ActorTag.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertActorTag', selectionSet, objects, onConflict);

    for (const inserted of data.insertActorTag.returning) {
      const actorTag = await this.actorTagRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.ActorTag, actorTag);
    }

    // Custom logic
    return data.insertActorTag;
  }

  async updateActorTagMany(selectionSet: string[], updates: Array<ActorTagUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const actorTags = await this.actorTagRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const actorTag = actorTags.find((actorTag) => actorTag.id === update.where.id._eq);
        if (!actorTag) throw new NotFoundException(`ActorTag (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, actorTag);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update ActorTag (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateActorTagMany', selectionSet, updates);

    await Promise.all(
      actorTags.map(async (actorTag) => {
        const update = updates.find((update) => update.where.id._eq === actorTag.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.ActorTag, actorTag, update._set);
      }),
    );

    // Custom logic
    return data.updateActorTagMany;
  }

  async updateActorTagByPk(selectionSet: string[], pkColumns: ActorTagPkColumnsInput, _set: ActorTagSetInput) {
    const actorTag = await this.actorTagRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, actorTag);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update ActorTag (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateActorTagByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.ActorTag, actorTag, _set);

    // Custom logic
    return data.updateActorTagByPk;
  }

  async deleteActorTag(selectionSet: string[], where: ActorTagBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const actorTags = await this.actorTagRepository.findByIds(where.id._in);

    await Promise.all(
      actorTags.map(async (actorTag) => {
        const canDelete = await this.checkPermsDelete(actorTag);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete ActorTag (${actorTag.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateActorTag', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      actorTags.map(async (actorTag) => {
        await this.logsService.deleteLog(EntityName.ActorTag, actorTag.id);
      }),
    );

    // Custom logic
    return data.updateActorTag;
  }

  async deleteActorTagByPk(selectionSet: string[], id: string) {
    const actorTag = await this.actorTagRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(actorTag);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete ActorTag (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateActorTagByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.ActorTag, id);
    // Custom logic
    return data.updateActorTagByPk;
  }

  async aggregateActorTag(
    selectionSet: string[],
    where: ActorTagBoolExp,
    orderBy?: Array<ActorTagOrderBy>,
    distinctOn?: Array<ActorTagSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'actorTagAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.actorTagAggregate;
  }
}
