import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActionRepository, Action } from '@okampus/api/dal';
import { ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class ActionsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly actionRepository: ActionRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['ActionInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const action = await this.actionRepository.findOneOrFail(id);
    if (action.deletedAt) throw new NotFoundException(`Action was deleted on ${action.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['ActionSetInput'], action: Action) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (action.deletedAt) throw new NotFoundException(`Action was deleted on ${action.deletedAt}.`);
    if (action.hiddenAt) throw new NotFoundException('Action must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return action.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['ActionSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['ActionInsertInput']) {
    // Custom logic
    return true;
  }

  async insertAction(
    selectionSet: string[],
    objects: Array<ValueTypes['ActionInsertInput']>,
    onConflict?: ValueTypes['ActionOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert Action.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert Action.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertAction', selectionSet, objects, onConflict, insertOne);

    const action = await this.actionRepository.findOneOrFail(data.insertAction[0].id);
    await this.logsService.createLog(action);

    // Custom logic
    return data.insertAction;
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
    const action = await this.actionRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, action);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Action (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateActionByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(action, _set);

    // Custom logic
    return data.updateActionByPk;
  }

  async deleteActionByPk(selectionSet: string[], pkColumns: ValueTypes['ActionPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Action (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateActionByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(pkColumns.id);
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
