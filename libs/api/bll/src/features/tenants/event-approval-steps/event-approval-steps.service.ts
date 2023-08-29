import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { EventApprovalStepRepository, EventApprovalStep } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  EventApprovalStepInsertInput,
  EventApprovalStepOnConflict,
  EventApprovalStepBoolExp,
  EventApprovalStepOrderBy,
  EventApprovalStepSelectColumn,
  EventApprovalStepSetInput,
  EventApprovalStepUpdates,
  EventApprovalStepPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class EventApprovalStepsService extends RequestContext {
  private readonly logger = new Logger(EventApprovalStepsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventApprovalStepRepository: EventApprovalStepRepository,
  ) {
    super();
  }

  checkPermsCreate(props: EventApprovalStepInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(eventApprovalStep: EventApprovalStep) {
    if (eventApprovalStep.deletedAt)
      throw new NotFoundException(`EventApprovalStep was deleted on ${eventApprovalStep.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) &&
            role.tenant?.id === eventApprovalStep.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: EventApprovalStepSetInput, eventApprovalStep: EventApprovalStep) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventApprovalStep.deletedAt)
      throw new NotFoundException(`EventApprovalStep was deleted on ${eventApprovalStep.deletedAt}.`);
    if (eventApprovalStep.hiddenAt)
      throw new NotFoundException('EventApprovalStep must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) &&
            role.tenant?.id === eventApprovalStep.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return eventApprovalStep.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: EventApprovalStepSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: EventApprovalStepInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertEventApprovalStepOne(
    selectionSet: string[],
    object: EventApprovalStepInsertInput,
    onConflict?: EventApprovalStepOnConflict,
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventApprovalStep.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertEventApprovalStepOne', selectionSet, object, onConflict);

    const eventApprovalStep = await this.eventApprovalStepRepository.findOneOrFail(data.insertEventApprovalStepOne.id);
    await this.logsService.createLog(EntityName.EventApprovalStep, eventApprovalStep);

    // Custom logic
    return data.insertEventApprovalStepOne;
  }

  async findEventApprovalStep(
    selectionSet: string[],
    where: EventApprovalStepBoolExp,
    orderBy?: Array<EventApprovalStepOrderBy>,
    distinctOn?: Array<EventApprovalStepSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'eventApprovalStep',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventApprovalStep;
  }

  async findEventApprovalStepByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventApprovalStepByPk', selectionSet, { id });
    return data.eventApprovalStepByPk;
  }

  async insertEventApprovalStep(
    selectionSet: string[],
    objects: Array<EventApprovalStepInsertInput>,
    onConflict?: EventApprovalStepOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventApprovalStep.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertEventApprovalStep', selectionSet, objects, onConflict);

    for (const inserted of data.insertEventApprovalStep.returning) {
      const eventApprovalStep = await this.eventApprovalStepRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventApprovalStep, eventApprovalStep);
    }

    // Custom logic
    return data.insertEventApprovalStep;
  }

  async updateEventApprovalStepMany(selectionSet: string[], updates: Array<EventApprovalStepUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const eventApprovalSteps = await this.eventApprovalStepRepository.findByIds(
      updates.map((update) => update.where.id._eq),
    );
    for (const update of updates) {
      const eventApprovalStep = eventApprovalSteps.find(
        (eventApprovalStep) => eventApprovalStep.id === update.where.id._eq,
      );
      if (!eventApprovalStep) throw new NotFoundException(`EventApprovalStep (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, eventApprovalStep);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update EventApprovalStep (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateEventApprovalStepMany', selectionSet, updates);

    await Promise.all(
      eventApprovalSteps.map(async (eventApprovalStep) => {
        const update = updates.find((update) => update.where.id._eq === eventApprovalStep.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.EventApprovalStep, eventApprovalStep, update._set);
      }),
    );

    // Custom logic
    return data.updateEventApprovalStepMany;
  }

  async updateEventApprovalStepByPk(
    selectionSet: string[],
    pkColumns: EventApprovalStepPkColumnsInput,
    _set: EventApprovalStepSetInput,
  ) {
    const eventApprovalStep = await this.eventApprovalStepRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, eventApprovalStep);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventApprovalStep (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventApprovalStepByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventApprovalStep, eventApprovalStep, _set);

    // Custom logic
    return data.updateEventApprovalStepByPk;
  }

  async deleteEventApprovalStep(selectionSet: string[], where: EventApprovalStepBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const eventApprovalSteps = await this.eventApprovalStepRepository.findByIds(where.id._in);
    for (const eventApprovalStep of eventApprovalSteps) {
      const canDelete = this.checkPermsDelete(eventApprovalStep);
      if (!canDelete)
        throw new ForbiddenException(`You are not allowed to delete EventApprovalStep (${eventApprovalStep.id}).`);
    }

    const data = await this.hasuraService.update('updateEventApprovalStep', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      eventApprovalSteps.map(async (eventApprovalStep) => {
        await this.logsService.deleteLog(EntityName.EventApprovalStep, eventApprovalStep.id);
      }),
    );

    // Custom logic
    return data.updateEventApprovalStep;
  }

  async deleteEventApprovalStepByPk(selectionSet: string[], id: string) {
    const eventApprovalStep = await this.eventApprovalStepRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(eventApprovalStep);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventApprovalStep (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateEventApprovalStepByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.EventApprovalStep, id);
    // Custom logic
    return data.updateEventApprovalStepByPk;
  }

  async aggregateEventApprovalStep(
    selectionSet: string[],
    where: EventApprovalStepBoolExp,
    orderBy?: Array<EventApprovalStepOrderBy>,
    distinctOn?: Array<EventApprovalStepSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventApprovalStepAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventApprovalStepAggregate;
  }
}
