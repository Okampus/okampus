import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { EventFavoriteRepository, EventFavorite } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  EventFavoriteInsertInput,
  EventFavoriteOnConflict,
  EventFavoriteBoolExp,
  EventFavoriteOrderBy,
  EventFavoriteSelectColumn,
  EventFavoriteSetInput,
  EventFavoriteUpdates,
  EventFavoritePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class EventFavoritesService extends RequestContext {
  private readonly logger = new Logger(EventFavoritesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventFavoriteRepository: EventFavoriteRepository,
  ) {
    super();
  }

  checkPermsCreate(props: EventFavoriteInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(eventFavorite: EventFavorite) {
    if (eventFavorite.deletedAt)
      throw new NotFoundException(`EventFavorite was deleted on ${eventFavorite.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) &&
            role.tenant?.id === eventFavorite.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: EventFavoriteSetInput, eventFavorite: EventFavorite) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventFavorite.deletedAt)
      throw new NotFoundException(`EventFavorite was deleted on ${eventFavorite.deletedAt}.`);
    if (eventFavorite.hiddenAt) throw new NotFoundException('EventFavorite must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) &&
            role.tenant?.id === eventFavorite.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return eventFavorite.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: EventFavoriteSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: EventFavoriteInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertEventFavoriteOne(
    selectionSet: string[],
    object: EventFavoriteInsertInput,
    onConflict?: EventFavoriteOnConflict,
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventFavorite.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertEventFavoriteOne', selectionSet, object, onConflict);

    const eventFavorite = await this.eventFavoriteRepository.findOneOrFail(data.insertEventFavoriteOne.id);
    await this.logsService.createLog(EntityName.EventFavorite, eventFavorite);

    // Custom logic
    return data.insertEventFavoriteOne;
  }

  async findEventFavorite(
    selectionSet: string[],
    where: EventFavoriteBoolExp,
    orderBy?: Array<EventFavoriteOrderBy>,
    distinctOn?: Array<EventFavoriteSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'eventFavorite',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventFavorite;
  }

  async findEventFavoriteByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventFavoriteByPk', selectionSet, { id });
    return data.eventFavoriteByPk;
  }

  async insertEventFavorite(
    selectionSet: string[],
    objects: Array<EventFavoriteInsertInput>,
    onConflict?: EventFavoriteOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventFavorite.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertEventFavorite', selectionSet, objects, onConflict);

    for (const inserted of data.insertEventFavorite.returning) {
      const eventFavorite = await this.eventFavoriteRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventFavorite, eventFavorite);
    }

    // Custom logic
    return data.insertEventFavorite;
  }

  async updateEventFavoriteMany(selectionSet: string[], updates: Array<EventFavoriteUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const eventFavorites = await this.eventFavoriteRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const eventFavorite = eventFavorites.find((eventFavorite) => eventFavorite.id === update.where.id._eq);
      if (!eventFavorite) throw new NotFoundException(`EventFavorite (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, eventFavorite);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update EventFavorite (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateEventFavoriteMany', selectionSet, updates);

    await Promise.all(
      eventFavorites.map(async (eventFavorite) => {
        const update = updates.find((update) => update.where.id._eq === eventFavorite.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.EventFavorite, eventFavorite, update._set);
      }),
    );

    // Custom logic
    return data.updateEventFavoriteMany;
  }

  async updateEventFavoriteByPk(
    selectionSet: string[],
    pkColumns: EventFavoritePkColumnsInput,
    _set: EventFavoriteSetInput,
  ) {
    const eventFavorite = await this.eventFavoriteRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, eventFavorite);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventFavorite (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventFavoriteByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventFavorite, eventFavorite, _set);

    // Custom logic
    return data.updateEventFavoriteByPk;
  }

  async deleteEventFavorite(selectionSet: string[], where: EventFavoriteBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const eventFavorites = await this.eventFavoriteRepository.findByIds(where.id._in);
    for (const eventFavorite of eventFavorites) {
      const canDelete = this.checkPermsDelete(eventFavorite);
      if (!canDelete)
        throw new ForbiddenException(`You are not allowed to delete EventFavorite (${eventFavorite.id}).`);
    }

    const data = await this.hasuraService.update('updateEventFavorite', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      eventFavorites.map(async (eventFavorite) => {
        await this.logsService.deleteLog(EntityName.EventFavorite, eventFavorite.id);
      }),
    );

    // Custom logic
    return data.updateEventFavorite;
  }

  async deleteEventFavoriteByPk(selectionSet: string[], id: string) {
    const eventFavorite = await this.eventFavoriteRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(eventFavorite);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventFavorite (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateEventFavoriteByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.EventFavorite, id);
    // Custom logic
    return data.updateEventFavoriteByPk;
  }

  async aggregateEventFavorite(
    selectionSet: string[],
    where: EventFavoriteBoolExp,
    orderBy?: Array<EventFavoriteOrderBy>,
    distinctOn?: Array<EventFavoriteSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventFavoriteAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventFavoriteAggregate;
  }
}
