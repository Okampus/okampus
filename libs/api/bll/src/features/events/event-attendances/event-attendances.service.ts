import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventAttendanceRepository, EventAttendance } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventAttendancesService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventAttendanceRepository: EventAttendanceRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['EventAttendanceInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const eventAttendance = await this.eventAttendanceRepository.findOneOrFail(id);
    if (eventAttendance.deletedAt)
      throw new NotFoundException(`EventAttendance was deleted on ${eventAttendance.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['EventAttendanceSetInput'], eventAttendance: EventAttendance) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventAttendance.deletedAt)
      throw new NotFoundException(`EventAttendance was deleted on ${eventAttendance.deletedAt}.`);
    if (eventAttendance.hiddenAt)
      throw new NotFoundException('EventAttendance must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return eventAttendance.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['EventAttendanceSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['EventAttendanceInsertInput']) {
    // Custom logic
    return true;
  }

  async insertEventAttendanceOne(
    selectionSet: string[],
    object: ValueTypes['EventAttendanceInsertInput'],
    onConflict?: ValueTypes['EventAttendanceOnConflict']
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventAttendance.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertEventAttendanceOne', selectionSet, object, onConflict);

    const eventAttendance = await this.eventAttendanceRepository.findOneOrFail(data.insertEventAttendanceOne.id);
    await this.logsService.createLog(EntityName.EventAttendance, eventAttendance);

    // Custom logic
    return data.insertEventAttendanceOne;
  }

  async findEventAttendance(
    selectionSet: string[],
    where: ValueTypes['EventAttendanceBoolExp'],
    orderBy?: Array<ValueTypes['EventAttendanceOrderBy']>,
    distinctOn?: Array<ValueTypes['EventAttendanceSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'eventAttendance',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.eventAttendance;
  }

  async findEventAttendanceByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventAttendanceByPk', selectionSet, { id });
    return data.eventAttendanceByPk;
  }

  async updateEventAttendanceByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['EventAttendancePkColumnsInput'],
    _set: ValueTypes['EventAttendanceSetInput']
  ) {
    const eventAttendance = await this.eventAttendanceRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, eventAttendance);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventAttendance (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateEventAttendanceByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventAttendance, eventAttendance, _set);

    // Custom logic
    return data.updateEventAttendanceByPk;
  }

  async deleteEventAttendanceByPk(selectionSet: string[], pkColumns: ValueTypes['EventAttendancePkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventAttendance (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateEventAttendanceByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.EventAttendance, pkColumns.id);
    // Custom logic
    return data.updateEventAttendanceByPk;
  }

  async aggregateEventAttendance(
    selectionSet: string[],
    where: ValueTypes['EventAttendanceBoolExp'],
    orderBy?: Array<ValueTypes['EventAttendanceOrderBy']>,
    distinctOn?: Array<ValueTypes['EventAttendanceSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventAttendanceAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.eventAttendanceAggregate;
  }
}
