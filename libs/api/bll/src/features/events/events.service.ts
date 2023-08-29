import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { EventRepository, Event } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  EventInsertInput,
  EventOnConflict,
  EventBoolExp,
  EventOrderBy,
  EventSelectColumn,
  EventSetInput,
  EventUpdates,
  EventPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class EventsService extends RequestContext {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventRepository: EventRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: EventInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(event: Event) {
    if (event.deletedAt) throw new NotFoundException(`Event was deleted on ${event.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === event.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: EventSetInput, event: Event) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (event.deletedAt) throw new NotFoundException(`Event was deleted on ${event.deletedAt}.`);
    if (event.hiddenAt) throw new NotFoundException('Event must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === event.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return event.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: EventSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: EventInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    this.hasuraService.expectNestedRelationship(props, [{ path: 'location' }, { path: 'eventOrganizes' }]);

    return true;
  }

  async insertEventOne(selectionSet: string[], object: EventInsertInput, onConflict?: EventOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Event.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertEventOne', selectionSet, object, onConflict);

    const event = await this.eventRepository.findOneOrFail(data.insertEventOne.id);
    await this.logsService.createLog(EntityName.Event, event);

    // Custom logic
    return data.insertEventOne;
  }

  async findEvent(
    selectionSet: string[],
    where: EventBoolExp,
    orderBy?: Array<EventOrderBy>,
    distinctOn?: Array<EventSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('event', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.event;
  }

  async findEventByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventByPk', selectionSet, { id });
    return data.eventByPk;
  }

  async insertEvent(selectionSet: string[], objects: Array<EventInsertInput>, onConflict?: EventOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Event.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertEvent', selectionSet, objects, onConflict);

    for (const inserted of data.insertEvent.returning) {
      const event = await this.eventRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Event, event);
    }

    // Custom logic
    return data.insertEvent;
  }

  async updateEventMany(selectionSet: string[], updates: Array<EventUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const events = await this.eventRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const event = events.find((event) => event.id === update.where.id._eq);
        if (!event) throw new NotFoundException(`Event (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, event);
        if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Event (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateEventMany', selectionSet, updates);

    await Promise.all(
      events.map(async (event) => {
        const update = updates.find((update) => update.where.id._eq === event.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Event, event, update._set);
      }),
    );

    // Custom logic
    return data.updateEventMany;
  }

  async updateEventByPk(selectionSet: string[], pkColumns: EventPkColumnsInput, _set: EventSetInput) {
    const event = await this.eventRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, event);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Event (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Event, event, _set);

    // Custom logic
    return data.updateEventByPk;
  }

  async deleteEvent(selectionSet: string[], where: EventBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const events = await this.eventRepository.findByIds(where.id._in);

    await Promise.all(
      events.map(async (event) => {
        const canDelete = await this.checkPermsDelete(event);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Event (${event.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateEvent', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      events.map(async (event) => {
        await this.logsService.deleteLog(EntityName.Event, event.id);
      }),
    );

    // Custom logic
    return data.updateEvent;
  }

  async deleteEventByPk(selectionSet: string[], id: string) {
    const event = await this.eventRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(event);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Event (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateEventByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Event, id);
    // Custom logic
    return data.updateEventByPk;
  }

  async aggregateEvent(
    selectionSet: string[],
    where: EventBoolExp,
    orderBy?: Array<EventOrderBy>,
    distinctOn?: Array<EventSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventAggregate;
  }
}
