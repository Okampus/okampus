import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorRepository, Actor } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class ActorsService extends RequestContext {
  private readonly logger = new Logger(ActorsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly actorRepository: ActorRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['ActorInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(actor: Actor) {
    if (actor.deletedAt) throw new NotFoundException(`Actor was deleted on ${actor.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === actor.tenant?.id
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['ActorSetInput'], actor: Actor) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (actor.deletedAt) throw new NotFoundException(`Actor was deleted on ${actor.deletedAt}.`);
    if (actor.hiddenAt) throw new NotFoundException('Actor must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === actor.tenant?.id
        )
    )
      return true;

    // Custom logic
    return actor.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['ActorSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['ActorInsertInput']) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertActorOne(
    selectionSet: string[],
    object: ValueTypes['ActorInsertInput'],
    onConflict?: ValueTypes['ActorOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Actor.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertActorOne', selectionSet, object, onConflict);

    const actor = await this.actorRepository.findOneOrFail(data.insertActorOne.id);
    await this.logsService.createLog(EntityName.Actor, actor);

    // Custom logic
    return data.insertActorOne;
  }

  async findActor(
    selectionSet: string[],
    where: ValueTypes['ActorBoolExp'],
    orderBy?: Array<ValueTypes['ActorOrderBy']>,
    distinctOn?: Array<ValueTypes['ActorSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('actor', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.actor;
  }

  async findActorByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('actorByPk', selectionSet, { id });
    return data.actorByPk;
  }

  async insertActor(
    selectionSet: string[],
    objects: Array<ValueTypes['ActorInsertInput']>,
    onConflict?: ValueTypes['ActorOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Actor.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertActor', selectionSet, objects, onConflict);

    for (const inserted of data.insertActor.returning) {
      const actor = await this.actorRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Actor, actor);
    }

    // Custom logic
    return data.insertActor;
  }

  async updateActorMany(selectionSet: string[], updates: Array<ValueTypes['ActorUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const actors = await this.actorRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const actor = actors.find((actor) => actor.id === update.where.id._eq);
      if (!actor) throw new NotFoundException(`Actor (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, actor);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Actor (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateActorMany', selectionSet, updates);

    await Promise.all(
      actors.map(async (actor) => {
        const update = updates.find((update) => update.where.id._eq === actor.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Actor, actor, update._set);
      })
    );

    // Custom logic
    return data.updateActorMany;
  }

  async updateActorByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['ActorPkColumnsInput'],
    _set: ValueTypes['ActorSetInput']
  ) {
    const actor = await this.actorRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, actor);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Actor (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateActorByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Actor, actor, _set);

    // Custom logic
    return data.updateActorByPk;
  }

  async deleteActor(selectionSet: string[], where: ValueTypes['ActorBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const actors = await this.actorRepository.findByIds(where.id._in);
    for (const actor of actors) {
      const canDelete = this.checkPermsDelete(actor);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Actor (${actor.id}).`);
    }

    const data = await this.hasuraService.update('updateActor', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      actors.map(async (actor) => {
        await this.logsService.deleteLog(EntityName.Actor, actor.id);
      })
    );

    // Custom logic
    return data.updateActor;
  }

  async deleteActorByPk(selectionSet: string[], pkColumns: ValueTypes['ActorPkColumnsInput']) {
    const actor = await this.actorRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(actor);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Actor (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateActorByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Actor, pkColumns.id);
    // Custom logic
    return data.updateActorByPk;
  }

  async aggregateActor(
    selectionSet: string[],
    where: ValueTypes['ActorBoolExp'],
    orderBy?: Array<ValueTypes['ActorOrderBy']>,
    distinctOn?: Array<ValueTypes['ActorSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'actorAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.actorAggregate;
  }
}
