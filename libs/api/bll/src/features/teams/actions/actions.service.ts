import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActionRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class ActionsService extends RequestContext {
  constructor(private readonly actionRepository: ActionRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['ActionInsertInput']) {
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async insertAction(
    selectionSet: string[],
    objects: Array<ValueTypes['ActionInsertInput']>,
    onConflict?: ValueTypes['ActionOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert Action with invalid props.');

    const data = await this.hasuraService.insert('insertAction', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertAction;
  }

  async updateAction(selectionSet: string[], where: ValueTypes['ActionBoolExp'], _set: ValueTypes['ActionSetInput']) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Action with invalid props.');

    const data = await this.hasuraService.update('updateAction', selectionSet, where, _set);
    // Custom logic
    return data.updateAction;
  }

  async findAction(
    selectionSet: string[],
    where: ValueTypes['ActionBoolExp'],
    orderBy?: Array<ValueTypes['ActionOrderBy']>,
    distinctOn?: Array<ValueTypes['ActionSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('action', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.action;
  }

  async findActionByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('actionByPk', selectionSet, { id });
    return data.actionByPk;
  }

  async updateActionByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['ActionPkColumnsInput'],
    _set: ValueTypes['ActionSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Action with invalid props.');

    const data = await this.hasuraService.updateByPk('updateActionByPk', selectionSet, pkColumns, _set);
    // Custom logic
    return data.updateActionByPk;
  }

  async aggregateAction(
    selectionSet: string[],
    where: ValueTypes['ActionBoolExp'],
    orderBy?: Array<ValueTypes['ActionOrderBy']>,
    distinctOn?: Array<ValueTypes['ActionSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'actionAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.actionAggregate;
  }
}
