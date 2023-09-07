import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { EventOrganizeRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { EventOrganize } from '@okampus/api/dal';
import type {
  EventOrganizeInsertInput,
  EventOrganizeOnConflict,
  EventOrganizeBoolExp,
  EventOrganizeOrderBy,
  EventOrganizeSelectColumn,
  EventOrganizeSetInput,
  EventOrganizeUpdates,
  EventOrganizePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class EventOrganizesService extends RequestContext {
  private readonly logger = new Logger(EventOrganizesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventOrganizeRepository: EventOrganizeRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: EventOrganizeInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(eventOrganize: EventOrganize) {
    if (eventOrganize.deletedAt)
      throw new NotFoundException(`EventOrganize was deleted on ${eventOrganize.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canDeleteTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: EventOrganizeSetInput, eventOrganize: EventOrganize) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventOrganize.deletedAt)
      throw new NotFoundException(`EventOrganize was deleted on ${eventOrganize.deletedAt}.`);
    if (eventOrganize.hiddenAt) throw new NotFoundException('EventOrganize must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return eventOrganize.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: EventOrganizeSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: EventOrganizeInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertEventOrganizeOne(
    selectionSet: string[],
    object: EventOrganizeInsertInput,
    onConflict?: EventOrganizeOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventOrganize.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertEventOrganizeOne', selectionSet, object, onConflict);

    const eventOrganize = await this.eventOrganizeRepository.findOneOrFail(data.insertEventOrganizeOne.id);
    await this.logsService.createLog(EntityName.EventOrganize, eventOrganize);

    // Custom logic
    return data.insertEventOrganizeOne;
  }

  async findEventOrganize(
    selectionSet: string[],
    where: EventOrganizeBoolExp,
    orderBy?: Array<EventOrganizeOrderBy>,
    distinctOn?: Array<EventOrganizeSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'eventOrganize',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventOrganize;
  }

  async findEventOrganizeByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventOrganizeByPk', selectionSet, { id });
    return data.eventOrganizeByPk;
  }

  async insertEventOrganize(
    selectionSet: string[],
    objects: Array<EventOrganizeInsertInput>,
    onConflict?: EventOrganizeOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventOrganize.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertEventOrganize', selectionSet, objects, onConflict);

    for (const inserted of data.insertEventOrganize.returning) {
      const eventOrganize = await this.eventOrganizeRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventOrganize, eventOrganize);
    }

    // Custom logic
    return data.insertEventOrganize;
  }

  async updateEventOrganizeMany(selectionSet: string[], updates: Array<EventOrganizeUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const eventOrganizes = await this.eventOrganizeRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const eventOrganize = eventOrganizes.find((eventOrganize) => eventOrganize.id === update.where.id._eq);
        if (!eventOrganize) throw new NotFoundException(`EventOrganize (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, eventOrganize);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update EventOrganize (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateEventOrganizeMany', selectionSet, updates);

    await Promise.all(
      eventOrganizes.map(async (eventOrganize) => {
        const update = updates.find((update) => update.where.id._eq === eventOrganize.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.EventOrganize, eventOrganize, update._set);
      }),
    );

    // Custom logic
    return data.updateEventOrganizeMany;
  }

  async updateEventOrganizeByPk(
    selectionSet: string[],
    pkColumns: EventOrganizePkColumnsInput,
    _set: EventOrganizeSetInput,
  ) {
    const eventOrganize = await this.eventOrganizeRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, eventOrganize);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventOrganize (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventOrganizeByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventOrganize, eventOrganize, _set);

    // Custom logic
    return data.updateEventOrganizeByPk;
  }

  async deleteEventOrganize(selectionSet: string[], where: EventOrganizeBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const eventOrganizes = await this.eventOrganizeRepository.findByIds(where.id._in);

    await Promise.all(
      eventOrganizes.map(async (eventOrganize) => {
        const canDelete = await this.checkPermsDelete(eventOrganize);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete EventOrganize (${eventOrganize.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateEventOrganize', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      eventOrganizes.map(async (eventOrganize) => {
        await this.logsService.deleteLog(EntityName.EventOrganize, eventOrganize.id);
      }),
    );

    // Custom logic
    return data.updateEventOrganize;
  }

  async deleteEventOrganizeByPk(selectionSet: string[], id: string) {
    const eventOrganize = await this.eventOrganizeRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(eventOrganize);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventOrganize (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateEventOrganizeByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.EventOrganize, id);
    // Custom logic
    return data.updateEventOrganizeByPk;
  }

  async aggregateEventOrganize(
    selectionSet: string[],
    where: EventOrganizeBoolExp,
    orderBy?: Array<EventOrganizeOrderBy>,
    distinctOn?: Array<EventOrganizeSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventOrganizeAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventOrganizeAggregate;
  }
}
