import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalRepository, EventApproval } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventApprovalsService extends RequestContext {
  private readonly logger = new Logger(EventApprovalsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventApprovalRepository: EventApprovalRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['EventApprovalInsertInput']) {
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
            role.tenant?.id === eventApproval.tenant?.id
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['EventApprovalSetInput'], eventApproval: EventApproval) {
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
            role.tenant?.id === eventApproval.tenant?.id
        )
    )
      return true;

    // Custom logic
    return eventApproval.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['EventApprovalSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['EventApprovalInsertInput']) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertEventApprovalOne(
    selectionSet: string[],
    object: ValueTypes['EventApprovalInsertInput'],
    onConflict?: ValueTypes['EventApprovalOnConflict']
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
    where: ValueTypes['EventApprovalBoolExp'],
    orderBy?: Array<ValueTypes['EventApprovalOrderBy']>,
    distinctOn?: Array<ValueTypes['EventApprovalSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'eventApproval',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
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
    objects: Array<ValueTypes['EventApprovalInsertInput']>,
    onConflict?: ValueTypes['EventApprovalOnConflict']
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

  async updateEventApprovalMany(selectionSet: string[], updates: Array<ValueTypes['EventApprovalUpdates']>) {
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
      })
    );

    // Custom logic
    return data.updateEventApprovalMany;
  }

  async updateEventApprovalByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['EventApprovalPkColumnsInput'],
    _set: ValueTypes['EventApprovalSetInput']
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

  async deleteEventApproval(selectionSet: string[], where: ValueTypes['EventApprovalBoolExp']) {
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
      })
    );

    // Custom logic
    return data.updateEventApproval;
  }

  async deleteEventApprovalByPk(selectionSet: string[], pkColumns: ValueTypes['EventApprovalPkColumnsInput']) {
    const eventApproval = await this.eventApprovalRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(eventApproval);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventApproval (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateEventApprovalByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.EventApproval, pkColumns.id);
    // Custom logic
    return data.updateEventApprovalByPk;
  }

  async aggregateEventApproval(
    selectionSet: string[],
    where: ValueTypes['EventApprovalBoolExp'],
    orderBy?: Array<ValueTypes['EventApprovalOrderBy']>,
    distinctOn?: Array<ValueTypes['EventApprovalSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventApprovalAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.eventApprovalAggregate;
  }
}