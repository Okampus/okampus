import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { ActorRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Actor } from '@okampus/api/dal';
import type {
  ActorInsertInput,
  ActorOnConflict,
  ActorBoolExp,
  ActorOrderBy,
  ActorSelectColumn,
  ActorSetInput,
  ActorUpdates,
  ActorPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class ActorsService extends RequestContext {
  private readonly logger = new Logger(ActorsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly actorRepository: ActorRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: ActorInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    

    // Custom logic
    return false;
  }

  async checkPermsDelete(actor: Actor) {
    if (actor.deletedAt) throw new NotFoundException(`Actor was deleted on ${actor.deletedAt}.`);
    

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ActorSetInput, actor: Actor) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (actor.deletedAt) throw new NotFoundException(`Actor was deleted on ${actor.deletedAt}.`);
    

    // Custom logic
    return actor.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ActorSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ActorInsertInput) {
    // Custom logic
    
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertActorOne(
    selectionSet: string[],
    object: ActorInsertInput,
    onConflict?: ActorOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Actor.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertActorOne', selectionSet, object, onConflict);

    const actor = await this.actorRepository.findOneOrFail(data.insertActorOne.id);
    await this.logsService.createLog(EntityName.Actor, actor);

    // Custom logic
    return data.insertActorOne;
  }

  async findActor(
    selectionSet: string[],
    where: ActorBoolExp,
    orderBy?: Array<ActorOrderBy>,
    distinctOn?: Array<ActorSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('actor', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.actor;
  }

  async findActorByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('actorByPk', selectionSet, {  id,  });
    return data.actorByPk;
  }

  async insertActor(
    selectionSet: string[],
    objects: Array<ActorInsertInput>,
    onConflict?: ActorOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Actor.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertActor', selectionSet, objects, onConflict);

    for (const inserted of data.insertActor.returning) {
      const actor = await this.actorRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Actor, actor);
    }

    // Custom logic
    return data.insertActor;
  }

  async updateActorMany(
    selectionSet: string[],
    updates: Array<ActorUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const actors = await this.actorRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(updates.map(async (update) => {
      const actor = actors.find((actor) => actor.id === update.where.id._eq);
      if (!actor) throw new NotFoundException(`Actor (${update.where.id._eq}) was not found.`);

      const canUpdate = await this.checkPermsUpdate(update._set, actor);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Actor (${update.where.id._eq}).`);

      const arePropsValid = await this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }));

    const data = await this.hasuraService.updateMany('updateActorMany', selectionSet, updates);

    await Promise.all(actors.map(async (actor) => {
      const update = updates.find((update) => update.where.id._eq === actor.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.Actor, actor, update._set);
    }));

    // Custom logic
    return data.updateActorMany;
  }

  async updateActorByPk(
    selectionSet: string[],
    pkColumns: ActorPkColumnsInput,
    _set: ActorSetInput,
  ) {
    const actor = await this.actorRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, actor);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Actor (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateActorByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Actor, actor, _set);

    // Custom logic
    return data.updateActorByPk;
  }

  async deleteActor(
    selectionSet: string[],
    where: ActorBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const actors = await this.actorRepository.findByIds(where.id._in);

    await Promise.all(actors.map(async (actor) => {
      const canDelete = await this.checkPermsDelete(actor);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Actor (${actor.id}).`);
    }));

    const data = await this.hasuraService.update('updateActor', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(actors.map(async (actor) => {
      await this.logsService.deleteLog(EntityName.Actor, actor.id);
    }));

    // Custom logic
    return data.updateActor;
  }

  async deleteActorByPk(
    selectionSet: string[],
    id: string,
  ) {
    const actor = await this.actorRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(actor);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Actor (${id}).`);

    const data = await this.hasuraService.updateByPk('updateActorByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Actor, id);
    // Custom logic
    return data.updateActorByPk;
  }

  async aggregateActor(
    selectionSet: string[],
    where: ActorBoolExp,
    orderBy?: Array<ActorOrderBy>,
    distinctOn?: Array<ActorSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('actorAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.actorAggregate;
  }
}