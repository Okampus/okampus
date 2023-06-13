import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepRepository, EventApprovalStep } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventApprovalStepsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly eventApprovalStepRepository: EventApprovalStepRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['EventApprovalStepInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const eventApprovalStep = await this.eventApprovalStepRepository.findOneOrFail(id);
    if (eventApprovalStep.deletedAt)
      throw new NotFoundException(`EventApprovalStep was deleted on ${eventApprovalStep.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['EventApprovalStepSetInput'], eventApprovalStep: EventApprovalStep) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (eventApprovalStep.deletedAt)
      throw new NotFoundException(`EventApprovalStep was deleted on ${eventApprovalStep.deletedAt}.`);
    if (eventApprovalStep.hiddenAt)
      throw new NotFoundException('EventApprovalStep must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return eventApprovalStep.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['EventApprovalStepSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['EventApprovalStepInsertInput']) {
    // Custom logic
    return true;
  }

  async insertEventApprovalStep(
    selectionSet: string[],
    objects: Array<ValueTypes['EventApprovalStepInsertInput']>,
    onConflict?: ValueTypes['EventApprovalStepOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert EventApprovalStep.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert EventApprovalStep.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert(
      'insertEventApprovalStep',
      selectionSet,
      objects,
      onConflict,
      insertOne
    );

    for (const inserted of data.insertEventApprovalStep.returning) {
      const eventApprovalStep = await this.eventApprovalStepRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.EventApprovalStep, eventApprovalStep);
    }

    // Custom logic
    return data.insertEventApprovalStep;
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
    const eventApprovalStep = await this.eventApprovalStepRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, eventApprovalStep);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update EventApprovalStep (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateEventApprovalStepByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.EventApprovalStep, eventApprovalStep, _set);

    // Custom logic
    return data.updateEventApprovalStepByPk;
  }

  async deleteEventApprovalStepByPk(selectionSet: string[], pkColumns: ValueTypes['EventApprovalStepPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete EventApprovalStep (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateEventApprovalStepByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.EventApprovalStep, pkColumns.id);
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
