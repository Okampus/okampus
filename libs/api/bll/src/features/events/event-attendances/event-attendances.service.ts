import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventAttendanceRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventAttendancesService extends RequestContext {
  constructor(
    private readonly eventAttendanceRepository: EventAttendanceRepository,
    private readonly hasuraService: HasuraService
  ) {
    super();
  }

  validateProps(props: ValueTypes['EventAttendanceInsertInput']) {
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async insertEventAttendance(
    selectionSet: string[],
    objects: Array<ValueTypes['EventAttendanceInsertInput']>,
    onConflict?: ValueTypes['EventAttendanceOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert EventAttendance with invalid props.');

    const data = await this.hasuraService.insert('insertEventAttendance', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertEventAttendance;
  }

  async updateEventAttendance(
    selectionSet: string[],
    where: ValueTypes['EventAttendanceBoolExp'],
    _set: ValueTypes['EventAttendanceSetInput']
  ) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update EventAttendance with invalid props.');

    const data = await this.hasuraService.update('updateEventAttendance', selectionSet, where, _set);
    // Custom logic
    return data.updateEventAttendance;
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
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update EventAttendance with invalid props.');

    const data = await this.hasuraService.updateByPk('updateEventAttendanceByPk', selectionSet, pkColumns, _set);
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
