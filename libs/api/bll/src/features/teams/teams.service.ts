import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamRepository, Team } from '@okampus/api/dal';
import { ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TeamsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamRepository: TeamRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['TeamInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const team = await this.teamRepository.findOneOrFail(id);
    if (team.deletedAt) throw new NotFoundException(`Team was deleted on ${team.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['TeamSetInput'], team: Team) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (team.deletedAt) throw new NotFoundException(`Team was deleted on ${team.deletedAt}.`);
    if (team.hiddenAt) throw new NotFoundException('Team must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return team.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['TeamSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['TeamInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTeam(
    selectionSet: string[],
    objects: Array<ValueTypes['TeamInsertInput']>,
    onConflict?: ValueTypes['TeamOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert Team.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert Team.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertTeam', selectionSet, objects, onConflict, insertOne);

    const team = await this.teamRepository.findOneOrFail(data.insertTeam[0].id);
    await this.logsService.createLog(team);

    // Custom logic
    return data.insertTeam;
  }

  async findTeam(
    selectionSet: string[],
    where: ValueTypes['TeamBoolExp'],
    orderBy?: Array<ValueTypes['TeamOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('team', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.team;
  }

  async findTeamByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamByPk', selectionSet, { id });
    return data.teamByPk;
  }

  async updateTeamByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TeamPkColumnsInput'],
    _set: ValueTypes['TeamSetInput']
  ) {
    const team = await this.teamRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, team);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Team (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateTeamByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(team, _set);

    // Custom logic
    return data.updateTeamByPk;
  }

  async deleteTeamByPk(selectionSet: string[], pkColumns: ValueTypes['TeamPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Team (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateTeamByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(pkColumns.id);
    // Custom logic
    return data.updateTeamByPk;
  }

  async aggregateTeam(
    selectionSet: string[],
    where: ValueTypes['TeamBoolExp'],
    orderBy?: Array<ValueTypes['TeamOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.teamAggregate;
  }
}
