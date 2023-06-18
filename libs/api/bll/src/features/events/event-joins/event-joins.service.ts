import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventJoinRepository, EventJoin } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventJoinsService extends RequestContext {
  private readonly logger = new Logger(EventJoinsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventJoinRepository: EventJoinRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['EventJoinInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(eventJoin: EventJoin) {
    if (eventJoin.deletedAt) throw new NotFoundException(`EventJoin was deleted on ${eventJoin.deletedAt}.`);
    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['EventJoinSetInput'], eventJoin: EventJoin) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventJoin.deletedAt) throw new NotFoundException(`EventJoin was deleted on ${eventJoin.deletedAt}.`);
    if (eventJoin.hiddenAt) throw new NotFoundException('EventJoin must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return eventJoin.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['EventJoinSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['EventJoinInsertInput']) {
    // Custom logic
    return true;
  }

  async insertEventJoinOne(
    selectionSet: string[],
    object: ValueTypes['EventJoinInsertInput'],
    onConflict?: ValueTypes['EventJoinOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventJoin.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertEventJoinOne', selectionSet, object, onConflict);

    const eventJoin = await this.eventJoinRepository.findOneOrFail(data.insertEventJoinOne.id);
    await this.logsService.createLog(EntityName.EventJoin, eventJoin);

    // Custom logic
    return data.insertEventJoinOne;
  }

  async findEventJoin(
    selectionSet: string[],
    where: ValueTypes['EventJoinBoolExp'],
    orderBy?: Array<ValueTypes['EventJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['EventJoinSelectColumn']>,
    limit?: number,
    offset?: number
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
    objects: Array<ValueTypes['EventJoinInsertInput']>,
    onConflict?: ValueTypes['EventJoinOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventJoin.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertEventJoin', selectionSet, objects, onConflict);

    for (const inserted of data.insertEventJoin.returning) {
      const eventJoin = await this.eventJoinRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventJoin, eventJoin);
    }

    // Custom logic
    return data.insertEventJoin;
  }

  async updateEventJoinMany(selectionSet: string[], updates: Array<ValueTypes['EventJoinUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const eventJoins = await this.eventJoinRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const eventJoin = eventJoins.find((eventJoin) => eventJoin.id === update.where.id._eq);
      if (!eventJoin) throw new NotFoundException(`EventJoin (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, eventJoin);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventJoin (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateEventJoinMany', selectionSet, updates);

    await Promise.all(
      eventJoins.map(async (eventJoin) => {
        const update = updates.find((update) => update.where.id._eq === eventJoin.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.EventJoin, eventJoin, update._set);
      })
    );

    // Custom logic
    return data.updateEventJoinMany;
  }

  async updateEventJoinByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['EventJoinPkColumnsInput'],
    _set: ValueTypes['EventJoinSetInput']
  ) {
    const eventJoin = await this.eventJoinRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, eventJoin);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventJoin (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventJoinByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventJoin, eventJoin, _set);

    // Custom logic
    return data.updateEventJoinByPk;
  }

  async deleteEventJoin(selectionSet: string[], where: ValueTypes['EventJoinBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const eventJoins = await this.eventJoinRepository.findByIds(where.id._in);
    for (const eventJoin of eventJoins) {
      const canDelete = this.checkPermsDelete(eventJoin);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventJoin (${eventJoin.id}).`);
    }

    const data = await this.hasuraService.update('updateEventJoin', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      eventJoins.map(async (eventJoin) => {
        await this.logsService.deleteLog(EntityName.EventJoin, eventJoin.id);
      })
    );

    // Custom logic
    return data.updateEventJoin;
  }

  async deleteEventJoinByPk(selectionSet: string[], pkColumns: ValueTypes['EventJoinPkColumnsInput']) {
    const eventJoin = await this.eventJoinRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(eventJoin);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventJoin (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateEventJoinByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.EventJoin, pkColumns.id);
    // Custom logic
    return data.updateEventJoinByPk;
  }

  async aggregateEventJoin(
    selectionSet: string[],
    where: ValueTypes['EventJoinBoolExp'],
    orderBy?: Array<ValueTypes['EventJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['EventJoinSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventJoinAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.eventJoinAggregate;
  }
}
