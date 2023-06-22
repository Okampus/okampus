import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventRepository, Event } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventsService extends RequestContext {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventRepository: EventRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['EventInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(event: Event) {
    if (event.deletedAt) throw new NotFoundException(`Event was deleted on ${event.deletedAt}.`);
    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['EventSetInput'], event: Event) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (event.deletedAt) throw new NotFoundException(`Event was deleted on ${event.deletedAt}.`);
    if (event.hiddenAt) throw new NotFoundException('Event must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return event.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['EventSetInput']) {
    this.hasuraService.checkForbiddenFields(props);
    props.tenantId = this.tenant().id;

    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['EventInsertInput']) {
    // Custom logic

    this.hasuraService.expectNestedRelationship(props, [{ path: 'content' }]);
    this.hasuraService.expectIdRelationships(props, ['teamId']);

    return true;
  }

  async insertEventOne(
    selectionSet: string[],
    object: ValueTypes['EventInsertInput'],
    onConflict?: ValueTypes['EventOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Event.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
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
    where: ValueTypes['EventBoolExp'],
    orderBy?: Array<ValueTypes['EventOrderBy']>,
    distinctOn?: Array<ValueTypes['EventSelectColumn']>,
    limit?: number,
    offset?: number
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

  async insertEvent(
    selectionSet: string[],
    objects: Array<ValueTypes['EventInsertInput']>,
    onConflict?: ValueTypes['EventOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Event.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
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

  async updateEventMany(selectionSet: string[], updates: Array<ValueTypes['EventUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const events = await this.eventRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const event = events.find((event) => event.id === update.where.id._eq);
      if (!event) throw new NotFoundException(`Event (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, event);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Event (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateEventMany', selectionSet, updates);

    await Promise.all(
      events.map(async (event) => {
        const update = updates.find((update) => update.where.id._eq === event.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Event, event, update._set);
      })
    );

    // Custom logic
    return data.updateEventMany;
  }

  async updateEventByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['EventPkColumnsInput'],
    _set: ValueTypes['EventSetInput']
  ) {
    const event = await this.eventRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, event);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Event (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Event, event, _set);

    // Custom logic
    return data.updateEventByPk;
  }

  async deleteEvent(selectionSet: string[], where: ValueTypes['EventBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const events = await this.eventRepository.findByIds(where.id._in);
    for (const event of events) {
      const canDelete = this.checkPermsDelete(event);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Event (${event.id}).`);
    }

    const data = await this.hasuraService.update('updateEvent', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      events.map(async (event) => {
        await this.logsService.deleteLog(EntityName.Event, event.id);
      })
    );

    // Custom logic
    return data.updateEvent;
  }

  async deleteEventByPk(selectionSet: string[], pkColumns: ValueTypes['EventPkColumnsInput']) {
    const event = await this.eventRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(event);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Event (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateEventByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Event, pkColumns.id);
    // Custom logic
    return data.updateEventByPk;
  }

  async aggregateEvent(
    selectionSet: string[],
    where: ValueTypes['EventBoolExp'],
    orderBy?: Array<ValueTypes['EventOrderBy']>,
    distinctOn?: Array<ValueTypes['EventSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.eventAggregate;
  }
}
