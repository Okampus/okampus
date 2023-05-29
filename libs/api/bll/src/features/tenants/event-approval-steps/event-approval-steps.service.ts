import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventApprovalStepsService extends RequestContext {
  constructor(
    private readonly eventApprovalStepRepository: EventApprovalStepRepository,
    private readonly hasuraService: HasuraService
  ) {
    super();
  }

  validateProps(props: ValueTypes['EventApprovalStepInsertInput']) {
    // Custom logic
    return true;
  }

  async insertEventApprovalStep(
    selectionSet: string[],
    objects: Array<ValueTypes['EventApprovalStepInsertInput']>,
    onConflict?: ValueTypes['EventApprovalStepOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert EventApprovalStep with invalid props.');

    const data = await this.hasuraService.insert(
      'insertEventApprovalStep',
      selectionSet,
      objects,
      onConflict,
      insertOne
    );
    // Custom logic
    return data.insertEventApprovalStep;
  }

  async updateEventApprovalStep(
    selectionSet: string[],
    where: ValueTypes['EventApprovalStepBoolExp'],
    _set: ValueTypes['EventApprovalStepSetInput']
  ) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update EventApprovalStep with invalid props.');

    const data = await this.hasuraService.update('updateEventApprovalStep', selectionSet, where, _set);
    // Custom logic
    return data.updateEventApprovalStep;
  }

  async findEventApprovalStep(
    selectionSet: string[],
    where: ValueTypes['EventApprovalStepBoolExp'],
    orderBy?: Array<ValueTypes['EventApprovalStepOrderBy']>,
    distinctOn?: Array<ValueTypes['EventApprovalStepSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'eventApprovalStep',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.eventApprovalStep;
  }

  async findEventApprovalStepByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventApprovalStepByPk', selectionSet, { id });
    return data.eventApprovalStepByPk;
  }

  async updateEventApprovalStepByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['EventApprovalStepPkColumnsInput'],
    _set: ValueTypes['EventApprovalStepSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update EventApprovalStep with invalid props.');

    const data = await this.hasuraService.updateByPk('updateEventApprovalStepByPk', selectionSet, pkColumns, _set);
    // Custom logic
    return data.updateEventApprovalStepByPk;
  }

  async aggregateEventApprovalStep(
    selectionSet: string[],
    where: ValueTypes['EventApprovalStepBoolExp'],
    orderBy?: Array<ValueTypes['EventApprovalStepOrderBy']>,
    distinctOn?: Array<ValueTypes['EventApprovalStepSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventApprovalStepAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.eventApprovalStepAggregate;
  }
}
