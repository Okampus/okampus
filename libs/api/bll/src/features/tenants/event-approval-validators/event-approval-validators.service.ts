import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { EventApprovalValidatorRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { EventApprovalValidator } from '@okampus/api/dal';
import type {
  EventApprovalValidatorInsertInput,
  EventApprovalValidatorOnConflict,
  EventApprovalValidatorBoolExp,
  EventApprovalValidatorOrderBy,
  EventApprovalValidatorSelectColumn,
  EventApprovalValidatorSetInput,
  EventApprovalValidatorUpdates,
  EventApprovalValidatorPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class EventApprovalValidatorsService extends RequestContext {
  private readonly logger = new Logger(EventApprovalValidatorsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventApprovalValidatorRepository: EventApprovalValidatorRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: EventApprovalValidatorInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(eventApprovalValidator: EventApprovalValidator) {
    if (eventApprovalValidator.deletedAt)
      throw new NotFoundException(`EventApprovalValidator was deleted on ${eventApprovalValidator.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canDeleteTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: EventApprovalValidatorSetInput, eventApprovalValidator: EventApprovalValidator) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventApprovalValidator.deletedAt)
      throw new NotFoundException(`EventApprovalValidator was deleted on ${eventApprovalValidator.deletedAt}.`);
    if (eventApprovalValidator.hiddenAt)
      throw new NotFoundException('EventApprovalValidator must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return eventApprovalValidator.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: EventApprovalValidatorSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: EventApprovalValidatorInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertEventApprovalValidatorOne(
    selectionSet: string[],
    object: EventApprovalValidatorInsertInput,
    onConflict?: EventApprovalValidatorOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventApprovalValidator.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne(
      'insertEventApprovalValidatorOne',
      selectionSet,
      object,
      onConflict,
    );

    const eventApprovalValidator = await this.eventApprovalValidatorRepository.findOneOrFail(
      data.insertEventApprovalValidatorOne.id,
    );
    await this.logsService.createLog(EntityName.EventApprovalValidator, eventApprovalValidator);

    // Custom logic
    return data.insertEventApprovalValidatorOne;
  }

  async findEventApprovalValidator(
    selectionSet: string[],
    where: EventApprovalValidatorBoolExp,
    orderBy?: Array<EventApprovalValidatorOrderBy>,
    distinctOn?: Array<EventApprovalValidatorSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'eventApprovalValidator',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventApprovalValidator;
  }

  async findEventApprovalValidatorByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventApprovalValidatorByPk', selectionSet, { id });
    return data.eventApprovalValidatorByPk;
  }

  async insertEventApprovalValidator(
    selectionSet: string[],
    objects: Array<EventApprovalValidatorInsertInput>,
    onConflict?: EventApprovalValidatorOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventApprovalValidator.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertEventApprovalValidator', selectionSet, objects, onConflict);

    for (const inserted of data.insertEventApprovalValidator.returning) {
      const eventApprovalValidator = await this.eventApprovalValidatorRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventApprovalValidator, eventApprovalValidator);
    }

    // Custom logic
    return data.insertEventApprovalValidator;
  }

  async updateEventApprovalValidatorMany(selectionSet: string[], updates: Array<EventApprovalValidatorUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const eventApprovalValidators = await this.eventApprovalValidatorRepository.findByIds(
      updates.map((update) => update.where.id._eq),
    );

    await Promise.all(
      updates.map(async (update) => {
        const eventApprovalValidator = eventApprovalValidators.find(
          (eventApprovalValidator) => eventApprovalValidator.id === update.where.id._eq,
        );
        if (!eventApprovalValidator)
          throw new NotFoundException(`EventApprovalValidator (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, eventApprovalValidator);
        if (!canUpdate)
          throw new ForbiddenException(
            `You are not allowed to update EventApprovalValidator (${update.where.id._eq}).`,
          );

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateEventApprovalValidatorMany', selectionSet, updates);

    await Promise.all(
      eventApprovalValidators.map(async (eventApprovalValidator) => {
        const update = updates.find((update) => update.where.id._eq === eventApprovalValidator.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.EventApprovalValidator, eventApprovalValidator, update._set);
      }),
    );

    // Custom logic
    return data.updateEventApprovalValidatorMany;
  }

  async updateEventApprovalValidatorByPk(
    selectionSet: string[],
    pkColumns: EventApprovalValidatorPkColumnsInput,
    _set: EventApprovalValidatorSetInput,
  ) {
    const eventApprovalValidator = await this.eventApprovalValidatorRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, eventApprovalValidator);
    if (!canUpdate)
      throw new ForbiddenException(`You are not allowed to update EventApprovalValidator (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateEventApprovalValidatorByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventApprovalValidator, eventApprovalValidator, _set);

    // Custom logic
    return data.updateEventApprovalValidatorByPk;
  }

  async deleteEventApprovalValidator(selectionSet: string[], where: EventApprovalValidatorBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const eventApprovalValidators = await this.eventApprovalValidatorRepository.findByIds(where.id._in);

    await Promise.all(
      eventApprovalValidators.map(async (eventApprovalValidator) => {
        const canDelete = await this.checkPermsDelete(eventApprovalValidator);
        if (!canDelete)
          throw new ForbiddenException(
            `You are not allowed to delete EventApprovalValidator (${eventApprovalValidator.id}).`,
          );
      }),
    );

    const data = await this.hasuraService.update('updateEventApprovalValidator', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      eventApprovalValidators.map(async (eventApprovalValidator) => {
        await this.logsService.deleteLog(EntityName.EventApprovalValidator, eventApprovalValidator.id);
      }),
    );

    // Custom logic
    return data.updateEventApprovalValidator;
  }

  async deleteEventApprovalValidatorByPk(selectionSet: string[], id: string) {
    const eventApprovalValidator = await this.eventApprovalValidatorRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(eventApprovalValidator);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventApprovalValidator (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateEventApprovalValidatorByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.EventApprovalValidator, id);
    // Custom logic
    return data.updateEventApprovalValidatorByPk;
  }

  async aggregateEventApprovalValidator(
    selectionSet: string[],
    where: EventApprovalValidatorBoolExp,
    orderBy?: Array<EventApprovalValidatorOrderBy>,
    distinctOn?: Array<EventApprovalValidatorSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventApprovalValidatorAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.eventApprovalValidatorAggregate;
  }
}
