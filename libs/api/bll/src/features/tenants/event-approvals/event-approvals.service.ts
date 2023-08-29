import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { EventApprovalRepository, EventApproval } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  EventApprovalInsertInput,
  EventApprovalOnConflict,
  EventApprovalBoolExp,
  EventApprovalOrderBy,
  EventApprovalSelectColumn,
  EventApprovalSetInput,
  EventApprovalUpdates,
  EventApprovalPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class EventApprovalsService extends RequestContext {
  private readonly logger = new Logger(EventApprovalsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventApprovalRepository: EventApprovalRepository,
  ) {
    super();
  }

  checkPermsCreate(props: EventApprovalInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(eventApproval: EventApproval) {
    if (eventApproval.deletedAt)
      throw new NotFoundException(`EventApproval was deleted on ${eventApproval.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) &&
            role.tenant?.id === eventApproval.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: EventApprovalSetInput, eventApproval: EventApproval) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventApproval.deletedAt)
      throw new NotFoundException(`EventApproval was deleted on ${eventApproval.deletedAt}.`);
    if (eventApproval.hiddenAt) throw new NotFoundException('EventApproval must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) &&
            role.tenant?.id === eventApproval.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return eventApproval.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: EventApprovalSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: EventApprovalInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertEventApprovalOne(
    selectionSet: string[],
    object: EventApprovalInsertInput,
    onConflict?: EventApprovalOnConflict,
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventApproval.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertEventApprovalOne', selectionSet, object, onConflict);

    const eventApproval = await this.eventApprovalRepository.findOneOrFail(data.insertEventApprovalOne.id);
    await this.logsService.createLog(EntityName.EventApproval, eventApproval);

    // Custom logic
    return data.insertEventApprovalOne;
  }

  async findEventApproval(
    selectionSet: string[],
    where: EventApprovalBoolExp,
    orderBy?: Array<EventApprovalOrderBy>,
    distinctOn?: Array<EventApprovalSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'eventApproval',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventApproval;
  }

  async findEventApprovalByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventApprovalByPk', selectionSet, { id });
    return data.eventApprovalByPk;
  }

  async insertEventApproval(
    selectionSet: string[],
    objects: Array<EventApprovalInsertInput>,
    onConflict?: EventApprovalOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventApproval.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertEventApproval', selectionSet, objects, onConflict);

    for (const inserted of data.insertEventApproval.returning) {
      const eventApproval = await this.eventApprovalRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventApproval, eventApproval);
    }

    // Custom logic
    return data.insertEventApproval;
  }

  async updateEventApprovalMany(selectionSet: string[], updates: Array<EventApprovalUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const eventApprovals = await this.eventApprovalRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const eventApproval = eventApprovals.find((eventApproval) => eventApproval.id === update.where.id._eq);
      if (!eventApproval) throw new NotFoundException(`EventApproval (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, eventApproval);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update EventApproval (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateEventApprovalMany', selectionSet, updates);

    await Promise.all(
      eventApprovals.map(async (eventApproval) => {
        const update = updates.find((update) => update.where.id._eq === eventApproval.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.EventApproval, eventApproval, update._set);
      }),
    );

    // Custom logic
    return data.updateEventApprovalMany;
  }

  async updateEventApprovalByPk(
    selectionSet: string[],
    pkColumns: EventApprovalPkColumnsInput,
    _set: EventApprovalSetInput,
  ) {
    const eventApproval = await this.eventApprovalRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, eventApproval);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventApproval (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventApprovalByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventApproval, eventApproval, _set);

    // Custom logic
    return data.updateEventApprovalByPk;
  }

  async deleteEventApproval(selectionSet: string[], where: EventApprovalBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const eventApprovals = await this.eventApprovalRepository.findByIds(where.id._in);
    for (const eventApproval of eventApprovals) {
      const canDelete = this.checkPermsDelete(eventApproval);
      if (!canDelete)
        throw new ForbiddenException(`You are not allowed to delete EventApproval (${eventApproval.id}).`);
    }

    const data = await this.hasuraService.update('updateEventApproval', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      eventApprovals.map(async (eventApproval) => {
        await this.logsService.deleteLog(EntityName.EventApproval, eventApproval.id);
      }),
    );

    // Custom logic
    return data.updateEventApproval;
  }

  async deleteEventApprovalByPk(selectionSet: string[], id: string) {
    const eventApproval = await this.eventApprovalRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(eventApproval);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventApproval (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateEventApprovalByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.EventApproval, id);
    // Custom logic
    return data.updateEventApprovalByPk;
  }

  async aggregateEventApproval(
    selectionSet: string[],
    where: EventApprovalBoolExp,
    orderBy?: Array<EventApprovalOrderBy>,
    distinctOn?: Array<EventApprovalSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventApprovalAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventApprovalAggregate;
  }
}
