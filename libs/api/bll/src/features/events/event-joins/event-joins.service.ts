import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { EventJoinRepository } from '@okampus/api/dal';
import { EntityName, ApprovalState } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { EventJoin } from '@okampus/api/dal';
import type {
  EventJoinInsertInput,
  EventJoinOnConflict,
  EventJoinBoolExp,
  EventJoinOrderBy,
  EventJoinSelectColumn,
  EventJoinSetInput,
  EventJoinUpdates,
  EventJoinPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class EventJoinsService extends RequestContext {
  private readonly logger = new Logger(EventJoinsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventJoinRepository: EventJoinRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: EventJoinInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return false;
  }

  async checkPermsDelete(eventJoin: EventJoin) {
    if (eventJoin.deletedAt) throw new NotFoundException(`EventJoin was deleted on ${eventJoin.deletedAt}.`);

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: EventJoinSetInput, eventJoin: EventJoin) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventJoin.deletedAt) throw new NotFoundException(`EventJoin was deleted on ${eventJoin.deletedAt}.`);

    // Custom logic
    return eventJoin.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: EventJoinSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    if (props.processedById) throw new BadRequestException('Cannot update processedById directly.');
    if (props.processedAt) throw new BadRequestException('Cannot update processedAt directly.');

    if (props.state === ApprovalState.Approved || props.state === ApprovalState.Rejected) {
      props.processedById = this.requester().id;
      props.processedAt = new Date().toISOString();
    }
    if (props.participationProcessedById)
      throw new BadRequestException('Cannot update participationProcessedById directly.');
    if (props.participationProcessedAt)
      throw new BadRequestException('Cannot update participationProcessedAt directly.');

    if (props.isPresent !== null) {
      props.participationProcessedById = this.requester().id;
      props.participationProcessedAt = new Date().toISOString();
    }

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: EventJoinInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    return true;
  }

  async insertEventJoinOne(selectionSet: string[], object: EventJoinInsertInput, onConflict?: EventJoinOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventJoin.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertEventJoinOne', selectionSet, object, onConflict);

    const eventJoin = await this.eventJoinRepository.findOneOrFail(data.insertEventJoinOne.id);
    await this.logsService.createLog(EntityName.EventJoin, eventJoin);

    // Custom logic
    return data.insertEventJoinOne;
  }

  async findEventJoin(
    selectionSet: string[],
    where: EventJoinBoolExp,
    orderBy?: Array<EventJoinOrderBy>,
    distinctOn?: Array<EventJoinSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('eventJoin', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.eventJoin;
  }

  async findEventJoinByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventJoinByPk', selectionSet, { id });
    return data.eventJoinByPk;
  }

  async insertEventJoin(
    selectionSet: string[],
    objects: Array<EventJoinInsertInput>,
    onConflict?: EventJoinOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventJoin.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertEventJoin', selectionSet, objects, onConflict);

    for (const inserted of data.insertEventJoin.returning) {
      const eventJoin = await this.eventJoinRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventJoin, eventJoin);
    }

    // Custom logic
    return data.insertEventJoin;
  }

  async updateEventJoinMany(selectionSet: string[], updates: Array<EventJoinUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const eventJoins = await this.eventJoinRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const eventJoin = eventJoins.find((eventJoin) => eventJoin.id === update.where.id._eq);
        if (!eventJoin) throw new NotFoundException(`EventJoin (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, eventJoin);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update EventJoin (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateEventJoinMany', selectionSet, updates);

    await Promise.all(
      eventJoins.map(async (eventJoin) => {
        const update = updates.find((update) => update.where.id._eq === eventJoin.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.EventJoin, eventJoin, update._set);
      }),
    );

    // Custom logic
    return data.updateEventJoinMany;
  }

  async updateEventJoinByPk(selectionSet: string[], pkColumns: EventJoinPkColumnsInput, _set: EventJoinSetInput) {
    const eventJoin = await this.eventJoinRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, eventJoin);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventJoin (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventJoinByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventJoin, eventJoin, _set);

    // Custom logic
    return data.updateEventJoinByPk;
  }

  async deleteEventJoin(selectionSet: string[], where: EventJoinBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const eventJoins = await this.eventJoinRepository.findByIds(where.id._in);

    await Promise.all(
      eventJoins.map(async (eventJoin) => {
        const canDelete = await this.checkPermsDelete(eventJoin);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventJoin (${eventJoin.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateEventJoin', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      eventJoins.map(async (eventJoin) => {
        await this.logsService.deleteLog(EntityName.EventJoin, eventJoin.id);
      }),
    );

    // Custom logic
    return data.updateEventJoin;
  }

  async deleteEventJoinByPk(selectionSet: string[], id: string) {
    const eventJoin = await this.eventJoinRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(eventJoin);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventJoin (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateEventJoinByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.EventJoin, id);
    // Custom logic
    return data.updateEventJoinByPk;
  }

  async aggregateEventJoin(
    selectionSet: string[],
    where: EventJoinBoolExp,
    orderBy?: Array<EventJoinOrderBy>,
    distinctOn?: Array<EventJoinSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventJoinAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventJoinAggregate;
  }
}
