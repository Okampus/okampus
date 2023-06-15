import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { IndividualRepository, Individual } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class IndividualsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly individualRepository: IndividualRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['IndividualInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const individual = await this.individualRepository.findOneOrFail(id);
    if (individual.deletedAt) throw new NotFoundException(`Individual was deleted on ${individual.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['IndividualSetInput'], individual: Individual) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (individual.deletedAt) throw new NotFoundException(`Individual was deleted on ${individual.deletedAt}.`);
    if (individual.hiddenAt) throw new NotFoundException('Individual must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return individual.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['IndividualSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['IndividualInsertInput']) {
    // Custom logic
    return true;
  }

  async insertIndividualOne(
    selectionSet: string[],
    object: ValueTypes['IndividualInsertInput'],
    onConflict?: ValueTypes['IndividualOnConflict']
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Individual.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertIndividualOne', selectionSet, object, onConflict);

    const individual = await this.individualRepository.findOneOrFail(data.insertIndividualOne.id);
    await this.logsService.createLog(EntityName.Individual, individual);

    // Custom logic
    return data.insertIndividualOne;
  }

  async findIndividual(
    selectionSet: string[],
    where: ValueTypes['IndividualBoolExp'],
    orderBy?: Array<ValueTypes['IndividualOrderBy']>,
    distinctOn?: Array<ValueTypes['IndividualSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('individual', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.individual;
  }

  async findIndividualByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('individualByPk', selectionSet, { id });
    return data.individualByPk;
  }

  async updateIndividualByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['IndividualPkColumnsInput'],
    _set: ValueTypes['IndividualSetInput']
  ) {
    const individual = await this.individualRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, individual);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Individual (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateIndividualByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Individual, individual, _set);

    // Custom logic
    return data.updateIndividualByPk;
  }

  async deleteIndividualByPk(selectionSet: string[], pkColumns: ValueTypes['IndividualPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Individual (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateIndividualByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Individual, pkColumns.id);
    // Custom logic
    return data.updateIndividualByPk;
  }

  async aggregateIndividual(
    selectionSet: string[],
    where: ValueTypes['IndividualBoolExp'],
    orderBy?: Array<ValueTypes['IndividualOrderBy']>,
    distinctOn?: Array<ValueTypes['IndividualSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'individualAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.individualAggregate;
  }
}
