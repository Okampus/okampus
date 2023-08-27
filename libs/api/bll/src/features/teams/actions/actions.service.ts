import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ActionRepository, Action } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  ActionInsertInput,
  ActionOnConflict,
  ActionBoolExp,
  ActionOrderBy,
  ActionSelectColumn,
  ActionSetInput,
  ActionUpdates,
  ActionPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class ActionsService extends RequestContext {
  private readonly logger = new Logger(ActionsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly actionRepository: ActionRepository,
  ) {
    super();
  }

  checkPermsCreate(props: ActionInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(action: Action) {
    if (action.deletedAt) throw new NotFoundException(`Action was deleted on ${action.deletedAt}.`);
    if (this.requester().adminRoles.getItems().some((role) => role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === action.tenant?.id)) 
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ActionSetInput, action: Action) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (action.deletedAt) throw new NotFoundException(`Action was deleted on ${action.deletedAt}.`);
    if (action.hiddenAt) throw new NotFoundException('Action must be unhidden before it can be updated.');

    if (this.requester().adminRoles.getItems().some((role) => role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === action.tenant?.id)) 
      return true;

    // Custom logic
    return action.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ActionSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ActionInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertActionOne(
    selectionSet: string[],
    object: ActionInsertInput,
    onConflict?: ActionOnConflict,
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Action.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertActionOne', selectionSet, object, onConflict);
  
    const action = await this.actionRepository.findOneOrFail(data.insertActionOne.id);
    await this.logsService.createLog(EntityName.Action, action);
    
    // Custom logic
    return data.insertActionOne;
  }

  async findAction(
    selectionSet: string[],
    where: ActionBoolExp,
    orderBy?: Array<ActionOrderBy>,
    distinctOn?: Array<ActionSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('action', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.action;
  }

  async findActionByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('actionByPk', selectionSet, {  id,  });
    return data.actionByPk;
  }

  async insertAction(
    selectionSet: string[],
    objects: Array<ActionInsertInput>,
    onConflict?: ActionOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Action.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertAction', selectionSet, objects, onConflict);

    for (const inserted of data.insertAction.returning) {
      const action = await this.actionRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Action, action);
    }

    // Custom logic
    return data.insertAction;
  }

  async updateActionMany(
    selectionSet: string[],
    updates: Array<ActionUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const actions = await this.actionRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const action = actions.find((action) => action.id === update.where.id._eq);
      if (!action) throw new NotFoundException(`Action (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, action);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Action (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateActionMany', selectionSet, updates);

    await Promise.all(actions.map(async (action) => {
      const update = updates.find((update) => update.where.id._eq === action.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.Action, action, update._set);
    }));

    // Custom logic
    return data.updateActionMany;
  }

  async updateActionByPk(
    selectionSet: string[],
    pkColumns: ActionPkColumnsInput,
    _set: ActionSetInput,
  ) {
    const action = await this.actionRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, action);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Action (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateActionByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Action, action, _set);

    // Custom logic
    return data.updateActionByPk;
  }

  async deleteAction(
    selectionSet: string[],
    where: ActionBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const actions = await this.actionRepository.findByIds(where.id._in);
    for (const action of actions) {
      const canDelete = this.checkPermsDelete(action);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Action (${action.id}).`);
    }

    const data = await this.hasuraService.update('updateAction', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(actions.map(async (action) => {
      await this.logsService.deleteLog(EntityName.Action, action.id);
    }));

    // Custom logic
    return data.updateAction;
  }

  async deleteActionByPk(
    selectionSet: string[],
    id: string,
  ) {
    const action = await this.actionRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(action);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Action (${id}).`);

    const data = await this.hasuraService.updateByPk('updateActionByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Action, id);
    // Custom logic
    return data.updateActionByPk;
  }

  async aggregateAction(
    selectionSet: string[],
    where: ActionBoolExp,
    orderBy?: Array<ActionOrderBy>,
    distinctOn?: Array<ActionSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('actionAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.actionAggregate;
  }
}