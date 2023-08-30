import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TeamRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Team } from '@okampus/api/dal';
import type {
  TeamInsertInput,
  TeamOnConflict,
  TeamBoolExp,
  TeamOrderBy,
  TeamSelectColumn,
  TeamSetInput,
  TeamUpdates,
  TeamPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TeamsService extends RequestContext {
  private readonly logger = new Logger(TeamsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamRepository: TeamRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TeamInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenant: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(team: Team) {
    if (team.deletedAt) throw new NotFoundException(`Team was deleted on ${team.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, team))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TeamSetInput, team: Team) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (team.deletedAt) throw new NotFoundException(`Team was deleted on ${team.deletedAt}.`);
    if (team.hiddenAt) throw new NotFoundException('Team must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, team))) return true;

    // Custom logic
    return team.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TeamSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TeamInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTeamOne(selectionSet: string[], object: TeamInsertInput, onConflict?: TeamOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Team.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTeamOne', selectionSet, object, onConflict);

    const team = await this.teamRepository.findOneOrFail(data.insertTeamOne.id);
    await this.logsService.createLog(EntityName.Team, team);

    // Custom logic
    return data.insertTeamOne;
  }

  async findTeam(
    selectionSet: string[],
    where: TeamBoolExp,
    orderBy?: Array<TeamOrderBy>,
    distinctOn?: Array<TeamSelectColumn>,
    limit?: number,
    offset?: number,
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

  async insertTeam(selectionSet: string[], objects: Array<TeamInsertInput>, onConflict?: TeamOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Team.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertTeam', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeam.returning) {
      const team = await this.teamRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Team, team);
    }

    // Custom logic
    return data.insertTeam;
  }

  async updateTeamMany(selectionSet: string[], updates: Array<TeamUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teams = await this.teamRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const team = teams.find((team) => team.id === update.where.id._eq);
        if (!team) throw new NotFoundException(`Team (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, team);
        if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Team (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTeamMany', selectionSet, updates);

    await Promise.all(
      teams.map(async (team) => {
        const update = updates.find((update) => update.where.id._eq === team.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Team, team, update._set);
      }),
    );

    // Custom logic
    return data.updateTeamMany;
  }

  async updateTeamByPk(selectionSet: string[], pkColumns: TeamPkColumnsInput, _set: TeamSetInput) {
    const team = await this.teamRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, team);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Team (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Team, team, _set);

    // Custom logic
    return data.updateTeamByPk;
  }

  async deleteTeam(selectionSet: string[], where: TeamBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teams = await this.teamRepository.findByIds(where.id._in);

    await Promise.all(
      teams.map(async (team) => {
        const canDelete = await this.checkPermsDelete(team);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Team (${team.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTeam', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teams.map(async (team) => {
        await this.logsService.deleteLog(EntityName.Team, team.id);
      }),
    );

    // Custom logic
    return data.updateTeam;
  }

  async deleteTeamByPk(selectionSet: string[], id: string) {
    const team = await this.teamRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(team);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Team (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTeamByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Team, id);
    // Custom logic
    return data.updateTeamByPk;
  }

  async aggregateTeam(
    selectionSet: string[],
    where: TeamBoolExp,
    orderBy?: Array<TeamOrderBy>,
    distinctOn?: Array<TeamSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamAggregate;
  }
}
