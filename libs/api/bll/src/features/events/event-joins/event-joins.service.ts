import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventJoinRepository, EventJoin } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventJoinsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventJoinRepository: EventJoinRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['EventJoinInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const eventJoin = await this.eventJoinRepository.findOneOrFail(id);
    if (eventJoin.deletedAt) throw new NotFoundException(`EventJoin was deleted on ${eventJoin.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['EventJoinSetInput'], eventJoin: EventJoin) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventJoin.deletedAt) throw new NotFoundException(`EventJoin was deleted on ${eventJoin.deletedAt}.`);
    if (eventJoin.hiddenAt) throw new NotFoundException('EventJoin must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return eventJoin.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['EventJoinSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['EventJoinInsertInput']) {
    // Custom logic
    return true;
  }

  async insertEventJoin(
    selectionSet: string[],
    objects: Array<ValueTypes['EventJoinInsertInput']>,
    onConflict?: ValueTypes['EventJoinOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventJoin.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert EventJoin.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertEventJoin', selectionSet, objects, onConflict, insertOne);

    for (const inserted of data.insertEventJoin.returning) {
      const eventJoin = await this.eventJoinRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventJoin, eventJoin);
    }

    // Custom logic
    return data.insertEventJoin;
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

  async updateEventJoinByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['EventJoinPkColumnsInput'],
    _set: ValueTypes['EventJoinSetInput']
  ) {
    const eventJoin = await this.eventJoinRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, eventJoin);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventJoin (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateEventJoinByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventJoin, eventJoin, _set);

    // Custom logic
    return data.updateEventJoinByPk;
  }

  async deleteEventJoinByPk(selectionSet: string[], pkColumns: ValueTypes['EventJoinPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
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
