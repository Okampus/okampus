import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFinanceRepository, TeamFinance } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TeamFinancesService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamFinanceRepository: TeamFinanceRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['TeamFinanceInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const teamFinance = await this.teamFinanceRepository.findOneOrFail(id);
    if (teamFinance.deletedAt) throw new NotFoundException(`TeamFinance was deleted on ${teamFinance.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['TeamFinanceSetInput'], teamFinance: TeamFinance) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamFinance.deletedAt) throw new NotFoundException(`TeamFinance was deleted on ${teamFinance.deletedAt}.`);
    if (teamFinance.hiddenAt) throw new NotFoundException('TeamFinance must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return teamFinance.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['TeamFinanceSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['TeamFinanceInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTeamFinanceOne(
    selectionSet: string[],
    object: ValueTypes['TeamFinanceInsertInput'],
    onConflict?: ValueTypes['TeamFinanceOnConflict']
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamFinance.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
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

  async updateTeamFinanceByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TeamFinancePkColumnsInput'],
    _set: ValueTypes['TeamFinanceSetInput']
  ) {
    const teamFinance = await this.teamFinanceRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, teamFinance);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamFinance (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateTeamFinanceByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamFinance, teamFinance, _set);

    // Custom logic
    return data.updateTeamFinanceByPk;
  }

  async deleteTeamFinanceByPk(selectionSet: string[], pkColumns: ValueTypes['TeamFinancePkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
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
