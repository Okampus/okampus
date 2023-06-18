import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFinanceRepository, TeamFinance } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TeamFinancesService extends RequestContext {
  private readonly logger = new Logger(TeamFinancesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamFinanceRepository: TeamFinanceRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['TeamFinanceInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(teamFinance: TeamFinance) {
    if (teamFinance.deletedAt) throw new NotFoundException(`TeamFinance was deleted on ${teamFinance.deletedAt}.`);
    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['TeamFinanceSetInput'], teamFinance: TeamFinance) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamFinance.deletedAt) throw new NotFoundException(`TeamFinance was deleted on ${teamFinance.deletedAt}.`);
    if (teamFinance.hiddenAt) throw new NotFoundException('TeamFinance must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return teamFinance.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['TeamFinanceSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['TeamFinanceInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTeamFinanceOne(
    selectionSet: string[],
    object: ValueTypes['TeamFinanceInsertInput'],
    onConflict?: ValueTypes['TeamFinanceOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamFinance.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertTeamFinanceOne', selectionSet, object, onConflict);

    const teamFinance = await this.teamFinanceRepository.findOneOrFail(data.insertTeamFinanceOne.id);
    await this.logsService.createLog(EntityName.TeamFinance, teamFinance);

    // Custom logic
    return data.insertTeamFinanceOne;
  }

  async findTeamFinance(
    selectionSet: string[],
    where: ValueTypes['TeamFinanceBoolExp'],
    orderBy?: Array<ValueTypes['TeamFinanceOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamFinanceSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('teamFinance', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.teamFinance;
  }

  async findTeamFinanceByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamFinanceByPk', selectionSet, { id });
    return data.teamFinanceByPk;
  }

  async insertTeamFinance(
    selectionSet: string[],
    objects: Array<ValueTypes['TeamFinanceInsertInput']>,
    onConflict?: ValueTypes['TeamFinanceOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamFinance.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertTeamFinance', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeamFinance.returning) {
      const teamFinance = await this.teamFinanceRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TeamFinance, teamFinance);
    }

    // Custom logic
    return data.insertTeamFinance;
  }

  async updateTeamFinanceMany(selectionSet: string[], updates: Array<ValueTypes['TeamFinanceUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teamFinances = await this.teamFinanceRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const teamFinance = teamFinances.find((teamFinance) => teamFinance.id === update.where.id._eq);
      if (!teamFinance) throw new NotFoundException(`TeamFinance (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, teamFinance);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update TeamFinance (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateTeamFinanceMany', selectionSet, updates);

    await Promise.all(
      teamFinances.map(async (teamFinance) => {
        const update = updates.find((update) => update.where.id._eq === teamFinance.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TeamFinance, teamFinance, update._set);
      })
    );

    // Custom logic
    return data.updateTeamFinanceMany;
  }

  async updateTeamFinanceByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TeamFinancePkColumnsInput'],
    _set: ValueTypes['TeamFinanceSetInput']
  ) {
    const teamFinance = await this.teamFinanceRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, teamFinance);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamFinance (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamFinanceByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamFinance, teamFinance, _set);

    // Custom logic
    return data.updateTeamFinanceByPk;
  }

  async deleteTeamFinance(selectionSet: string[], where: ValueTypes['TeamFinanceBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teamFinances = await this.teamFinanceRepository.findByIds(where.id._in);
    for (const teamFinance of teamFinances) {
      const canDelete = this.checkPermsDelete(teamFinance);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamFinance (${teamFinance.id}).`);
    }

    const data = await this.hasuraService.update('updateTeamFinance', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teamFinances.map(async (teamFinance) => {
        await this.logsService.deleteLog(EntityName.TeamFinance, teamFinance.id);
      })
    );

    // Custom logic
    return data.updateTeamFinance;
  }

  async deleteTeamFinanceByPk(selectionSet: string[], pkColumns: ValueTypes['TeamFinancePkColumnsInput']) {
    const teamFinance = await this.teamFinanceRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(teamFinance);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamFinance (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateTeamFinanceByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.TeamFinance, pkColumns.id);
    // Custom logic
    return data.updateTeamFinanceByPk;
  }

  async aggregateTeamFinance(
    selectionSet: string[],
    where: ValueTypes['TeamFinanceBoolExp'],
    orderBy?: Array<ValueTypes['TeamFinanceOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamFinanceSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamFinanceAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.teamFinanceAggregate;
  }
}
