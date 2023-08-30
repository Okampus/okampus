import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TeamHistoryRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { canAdminCreate, canAdminDelete, canAdminUpdate } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TeamHistory } from '@okampus/api/dal';
import type {
  TeamHistoryInsertInput,
  TeamHistoryOnConflict,
  TeamHistoryBoolExp,
  TeamHistoryOrderBy,
  TeamHistorySelectColumn,
  TeamHistorySetInput,
  TeamHistoryUpdates,
  TeamHistoryPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TeamHistoriesService extends RequestContext {
  private readonly logger = new Logger(TeamHistoriesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamHistoryRepository: TeamHistoryRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TeamHistoryInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminCreate(adminRole, this.tenant()))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(teamHistory: TeamHistory) {
    if (teamHistory.deletedAt) throw new NotFoundException(`TeamHistory was deleted on ${teamHistory.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, teamHistory))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TeamHistorySetInput, teamHistory: TeamHistory) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamHistory.deletedAt) throw new NotFoundException(`TeamHistory was deleted on ${teamHistory.deletedAt}.`);
    if (teamHistory.hiddenAt) throw new NotFoundException('TeamHistory must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminUpdate(adminRole, teamHistory))) return true;

    // Custom logic
    return teamHistory.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TeamHistorySetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TeamHistoryInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTeamHistoryOne(
    selectionSet: string[],
    object: TeamHistoryInsertInput,
    onConflict?: TeamHistoryOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamHistory.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertTeamHistoryOne', selectionSet, object, onConflict);

    const teamHistory = await this.teamHistoryRepository.findOneOrFail(data.insertTeamHistoryOne.id);
    await this.logsService.createLog(EntityName.TeamHistory, teamHistory);

    // Custom logic
    return data.insertTeamHistoryOne;
  }

  async findTeamHistory(
    selectionSet: string[],
    where: TeamHistoryBoolExp,
    orderBy?: Array<TeamHistoryOrderBy>,
    distinctOn?: Array<TeamHistorySelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('teamHistory', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.teamHistory;
  }

  async findTeamHistoryByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamHistoryByPk', selectionSet, { id });
    return data.teamHistoryByPk;
  }

  async insertTeamHistory(
    selectionSet: string[],
    objects: Array<TeamHistoryInsertInput>,
    onConflict?: TeamHistoryOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamHistory.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertTeamHistory', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeamHistory.returning) {
      const teamHistory = await this.teamHistoryRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TeamHistory, teamHistory);
    }

    // Custom logic
    return data.insertTeamHistory;
  }

  async updateTeamHistoryMany(selectionSet: string[], updates: Array<TeamHistoryUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teamHistories = await this.teamHistoryRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const teamHistory = teamHistories.find((teamHistory) => teamHistory.id === update.where.id._eq);
        if (!teamHistory) throw new NotFoundException(`TeamHistory (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, teamHistory);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update TeamHistory (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTeamHistoryMany', selectionSet, updates);

    await Promise.all(
      teamHistories.map(async (teamHistory) => {
        const update = updates.find((update) => update.where.id._eq === teamHistory.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TeamHistory, teamHistory, update._set);
      }),
    );

    // Custom logic
    return data.updateTeamHistoryMany;
  }

  async updateTeamHistoryByPk(selectionSet: string[], pkColumns: TeamHistoryPkColumnsInput, _set: TeamHistorySetInput) {
    const teamHistory = await this.teamHistoryRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, teamHistory);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamHistory (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamHistoryByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamHistory, teamHistory, _set);

    // Custom logic
    return data.updateTeamHistoryByPk;
  }

  async deleteTeamHistory(selectionSet: string[], where: TeamHistoryBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teamHistories = await this.teamHistoryRepository.findByIds(where.id._in);

    await Promise.all(
      teamHistories.map(async (teamHistory) => {
        const canDelete = await this.checkPermsDelete(teamHistory);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamHistory (${teamHistory.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTeamHistory', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teamHistories.map(async (teamHistory) => {
        await this.logsService.deleteLog(EntityName.TeamHistory, teamHistory.id);
      }),
    );

    // Custom logic
    return data.updateTeamHistory;
  }

  async deleteTeamHistoryByPk(selectionSet: string[], id: string) {
    const teamHistory = await this.teamHistoryRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(teamHistory);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamHistory (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTeamHistoryByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.TeamHistory, id);
    // Custom logic
    return data.updateTeamHistoryByPk;
  }

  async aggregateTeamHistory(
    selectionSet: string[],
    where: TeamHistoryBoolExp,
    orderBy?: Array<TeamHistoryOrderBy>,
    distinctOn?: Array<TeamHistorySelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamHistoryAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamHistoryAggregate;
  }
}
