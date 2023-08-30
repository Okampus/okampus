import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { EventSupervisorRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { canAdminCreate, canAdminDelete, canAdminUpdate } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { EventSupervisor } from '@okampus/api/dal';
import type {
  EventSupervisorInsertInput,
  EventSupervisorOnConflict,
  EventSupervisorBoolExp,
  EventSupervisorOrderBy,
  EventSupervisorSelectColumn,
  EventSupervisorSetInput,
  EventSupervisorUpdates,
  EventSupervisorPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class EventSupervisorsService extends RequestContext {
  private readonly logger = new Logger(EventSupervisorsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventSupervisorRepository: EventSupervisorRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: EventSupervisorInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminCreate(adminRole, this.tenant()))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(eventSupervisor: EventSupervisor) {
    if (eventSupervisor.deletedAt)
      throw new NotFoundException(`EventSupervisor was deleted on ${eventSupervisor.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, eventSupervisor))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: EventSupervisorSetInput, eventSupervisor: EventSupervisor) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventSupervisor.deletedAt)
      throw new NotFoundException(`EventSupervisor was deleted on ${eventSupervisor.deletedAt}.`);
    if (eventSupervisor.hiddenAt)
      throw new NotFoundException('EventSupervisor must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminUpdate(adminRole, eventSupervisor))) return true;

    // Custom logic
    return eventSupervisor.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: EventSupervisorSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: EventSupervisorInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertEventSupervisorOne(
    selectionSet: string[],
    object: EventSupervisorInsertInput,
    onConflict?: EventSupervisorOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventSupervisor.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertEventSupervisorOne', selectionSet, object, onConflict);

    const eventSupervisor = await this.eventSupervisorRepository.findOneOrFail(data.insertEventSupervisorOne.id);
    await this.logsService.createLog(EntityName.EventSupervisor, eventSupervisor);

    // Custom logic
    return data.insertEventSupervisorOne;
  }

  async findEventSupervisor(
    selectionSet: string[],
    where: EventSupervisorBoolExp,
    orderBy?: Array<EventSupervisorOrderBy>,
    distinctOn?: Array<EventSupervisorSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'eventSupervisor',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventSupervisor;
  }

  async findEventSupervisorByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventSupervisorByPk', selectionSet, { id });
    return data.eventSupervisorByPk;
  }

  async insertEventSupervisor(
    selectionSet: string[],
    objects: Array<EventSupervisorInsertInput>,
    onConflict?: EventSupervisorOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventSupervisor.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertEventSupervisor', selectionSet, objects, onConflict);

    for (const inserted of data.insertEventSupervisor.returning) {
      const eventSupervisor = await this.eventSupervisorRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventSupervisor, eventSupervisor);
    }

    // Custom logic
    return data.insertEventSupervisor;
  }

  async updateEventSupervisorMany(selectionSet: string[], updates: Array<EventSupervisorUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const eventSupervisors = await this.eventSupervisorRepository.findByIds(
      updates.map((update) => update.where.id._eq),
    );

    await Promise.all(
      updates.map(async (update) => {
        const eventSupervisor = eventSupervisors.find((eventSupervisor) => eventSupervisor.id === update.where.id._eq);
        if (!eventSupervisor) throw new NotFoundException(`EventSupervisor (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, eventSupervisor);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update EventSupervisor (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateEventSupervisorMany', selectionSet, updates);

    await Promise.all(
      eventSupervisors.map(async (eventSupervisor) => {
        const update = updates.find((update) => update.where.id._eq === eventSupervisor.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.EventSupervisor, eventSupervisor, update._set);
      }),
    );

    // Custom logic
    return data.updateEventSupervisorMany;
  }

  async updateEventSupervisorByPk(
    selectionSet: string[],
    pkColumns: EventSupervisorPkColumnsInput,
    _set: EventSupervisorSetInput,
  ) {
    const eventSupervisor = await this.eventSupervisorRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, eventSupervisor);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventSupervisor (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventSupervisorByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventSupervisor, eventSupervisor, _set);

    // Custom logic
    return data.updateEventSupervisorByPk;
  }

  async deleteEventSupervisor(selectionSet: string[], where: EventSupervisorBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const eventSupervisors = await this.eventSupervisorRepository.findByIds(where.id._in);

    await Promise.all(
      eventSupervisors.map(async (eventSupervisor) => {
        const canDelete = await this.checkPermsDelete(eventSupervisor);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete EventSupervisor (${eventSupervisor.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateEventSupervisor', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      eventSupervisors.map(async (eventSupervisor) => {
        await this.logsService.deleteLog(EntityName.EventSupervisor, eventSupervisor.id);
      }),
    );

    // Custom logic
    return data.updateEventSupervisor;
  }

  async deleteEventSupervisorByPk(selectionSet: string[], id: string) {
    const eventSupervisor = await this.eventSupervisorRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(eventSupervisor);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventSupervisor (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateEventSupervisorByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.EventSupervisor, id);
    // Custom logic
    return data.updateEventSupervisorByPk;
  }

  async aggregateEventSupervisor(
    selectionSet: string[],
    where: EventSupervisorBoolExp,
    orderBy?: Array<EventSupervisorOrderBy>,
    distinctOn?: Array<EventSupervisorSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventSupervisorAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventSupervisorAggregate;
  }
}
