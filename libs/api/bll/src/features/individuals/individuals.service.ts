import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { IndividualRepository, Individual } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class IndividualsService extends RequestContext {
  private readonly logger = new Logger(IndividualsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly individualRepository: IndividualRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['IndividualInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(individual: Individual) {
    if (individual.deletedAt) throw new NotFoundException(`Individual was deleted on ${individual.deletedAt}.`);
    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['IndividualSetInput'], individual: Individual) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (individual.deletedAt) throw new NotFoundException(`Individual was deleted on ${individual.deletedAt}.`);
    if (individual.hiddenAt) throw new NotFoundException('Individual must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return individual.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['IndividualSetInput']) {
    this.hasuraService.checkForbiddenFields(props);
    props.tenantId = this.tenant().id;

    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['IndividualInsertInput']) {
    // Custom logic

    return true;
  }

  async insertIndividualOne(
    selectionSet: string[],
    object: ValueTypes['IndividualInsertInput'],
    onConflict?: ValueTypes['IndividualOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Individual.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
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

  async insertIndividual(
    selectionSet: string[],
    objects: Array<ValueTypes['IndividualInsertInput']>,
    onConflict?: ValueTypes['IndividualOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Individual.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertIndividual', selectionSet, objects, onConflict);

    for (const inserted of data.insertIndividual.returning) {
      const individual = await this.individualRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Individual, individual);
    }

    // Custom logic
    return data.insertIndividual;
  }

  async updateIndividualMany(selectionSet: string[], updates: Array<ValueTypes['IndividualUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const individuals = await this.individualRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const individual = individuals.find((individual) => individual.id === update.where.id._eq);
      if (!individual) throw new NotFoundException(`Individual (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, individual);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update Individual (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateIndividualMany', selectionSet, updates);

    await Promise.all(
      individuals.map(async (individual) => {
        const update = updates.find((update) => update.where.id._eq === individual.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Individual, individual, update._set);
      })
    );

    // Custom logic
    return data.updateIndividualMany;
  }

  async updateIndividualByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['IndividualPkColumnsInput'],
    _set: ValueTypes['IndividualSetInput']
  ) {
    const individual = await this.individualRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, individual);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Individual (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateIndividualByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Individual, individual, _set);

    // Custom logic
    return data.updateIndividualByPk;
  }

  async deleteIndividual(selectionSet: string[], where: ValueTypes['IndividualBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const individuals = await this.individualRepository.findByIds(where.id._in);
    for (const individual of individuals) {
      const canDelete = this.checkPermsDelete(individual);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Individual (${individual.id}).`);
    }

    const data = await this.hasuraService.update('updateIndividual', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      individuals.map(async (individual) => {
        await this.logsService.deleteLog(EntityName.Individual, individual.id);
      })
    );

    // Custom logic
    return data.updateIndividual;
  }

  async deleteIndividualByPk(selectionSet: string[], pkColumns: ValueTypes['IndividualPkColumnsInput']) {
    const individual = await this.individualRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(individual);
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
