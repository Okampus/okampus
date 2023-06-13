import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventRepository, Event } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventRepository: EventRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['EventInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const event = await this.eventRepository.findOneOrFail(id);
    if (event.deletedAt) throw new NotFoundException(`Event was deleted on ${event.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['EventSetInput'], event: Event) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (event.deletedAt) throw new NotFoundException(`Event was deleted on ${event.deletedAt}.`);
    if (event.hiddenAt) throw new NotFoundException('Event must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return event.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['EventSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['EventInsertInput']) {
    // Custom logic
    return true;
  }

  async insertEvent(
    selectionSet: string[],
    objects: Array<ValueTypes['EventInsertInput']>,
    onConflict?: ValueTypes['EventOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert Event.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert Event.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertEvent', selectionSet, objects, onConflict, insertOne);

    for (const inserted of data.insertEvent.returning) {
      const event = await this.eventRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Event, event);
    }

    // Custom logic
    return data.insertEvent;
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

  async updateEventByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['EventPkColumnsInput'],
    _set: ValueTypes['EventSetInput']
  ) {
    const event = await this.eventRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, event);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Event (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateEventByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Event, event, _set);

    // Custom logic
    return data.updateEventByPk;
  }

  async deleteEventByPk(selectionSet: string[], pkColumns: ValueTypes['EventPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
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
