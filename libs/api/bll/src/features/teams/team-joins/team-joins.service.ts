import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamJoinRepository, TeamJoin } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TeamJoinsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamJoinRepository: TeamJoinRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['TeamJoinInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const teamJoin = await this.teamJoinRepository.findOneOrFail(id);
    if (teamJoin.deletedAt) throw new NotFoundException(`TeamJoin was deleted on ${teamJoin.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['TeamJoinSetInput'], teamJoin: TeamJoin) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamJoin.deletedAt) throw new NotFoundException(`TeamJoin was deleted on ${teamJoin.deletedAt}.`);
    if (teamJoin.hiddenAt) throw new NotFoundException('TeamJoin must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return teamJoin.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['TeamJoinSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['TeamJoinInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTeamJoinOne(
    selectionSet: string[],
    object: ValueTypes['TeamJoinInsertInput'],
    onConflict?: ValueTypes['TeamJoinOnConflict']
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamJoin.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertTeamJoinOne', selectionSet, object, onConflict);

    const teamJoin = await this.teamJoinRepository.findOneOrFail(data.insertTeamJoinOne.id);
    await this.logsService.createLog(EntityName.TeamJoin, teamJoin);

    // Custom logic
    return data.insertTeamJoinOne;
  }

  async findTeamJoin(
    selectionSet: string[],
    where: ValueTypes['TeamJoinBoolExp'],
    orderBy?: Array<ValueTypes['TeamJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamJoinSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('teamJoin', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.teamJoin;
  }

  async findTeamJoinByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamJoinByPk', selectionSet, { id });
    return data.teamJoinByPk;
  }

  async updateTeamJoinByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TeamJoinPkColumnsInput'],
    _set: ValueTypes['TeamJoinSetInput']
  ) {
    const teamJoin = await this.teamJoinRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, teamJoin);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamJoin (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateTeamJoinByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamJoin, teamJoin, _set);

    // Custom logic
    return data.updateTeamJoinByPk;
  }

  async deleteTeamJoinByPk(selectionSet: string[], pkColumns: ValueTypes['TeamJoinPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamJoin (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateTeamJoinByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.TeamJoin, pkColumns.id);
    // Custom logic
    return data.updateTeamJoinByPk;
  }

  async aggregateTeamJoin(
    selectionSet: string[],
    where: ValueTypes['TeamJoinBoolExp'],
    orderBy?: Array<ValueTypes['TeamJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamJoinSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamJoinAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.teamJoinAggregate;
  }
}
