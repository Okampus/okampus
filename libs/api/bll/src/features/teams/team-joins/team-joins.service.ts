import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TeamJoinRepository } from '@okampus/api/dal';
import { EntityName, ApprovalState } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TeamJoin } from '@okampus/api/dal';
import type {
  TeamJoinInsertInput,
  TeamJoinOnConflict,
  TeamJoinBoolExp,
  TeamJoinOrderBy,
  TeamJoinSelectColumn,
  TeamJoinSetInput,
  TeamJoinUpdates,
  TeamJoinPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TeamJoinsService extends RequestContext {
  private readonly logger = new Logger(TeamJoinsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamJoinRepository: TeamJoinRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TeamJoinInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(teamJoin: TeamJoin) {
    if (teamJoin.deletedAt) throw new NotFoundException(`TeamJoin was deleted on ${teamJoin.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canDeleteTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TeamJoinSetInput, teamJoin: TeamJoin) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamJoin.deletedAt) throw new NotFoundException(`TeamJoin was deleted on ${teamJoin.deletedAt}.`);
    if (teamJoin.hiddenAt) throw new NotFoundException('TeamJoin must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return teamJoin.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TeamJoinSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    if (props.processedById) throw new BadRequestException('Cannot update processedById directly.');
    if (props.processedAt) throw new BadRequestException('Cannot update processedAt directly.');

    if (props.state === ApprovalState.Rejected || props.state === ApprovalState.Approved) {
      props.processedById = this.requester().id;
      props.processedAt = new Date().toISOString();
    }

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TeamJoinInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    this.hasuraService.expectNestedRelationship(props, [{ path: 'submission' }]);

    return true;
  }

  async insertTeamJoinOne(selectionSet: string[], object: TeamJoinInsertInput, onConflict?: TeamJoinOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamJoin.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTeamJoinOne', selectionSet, object, onConflict);

    const teamJoin = await this.teamJoinRepository.findOneOrFail(data.insertTeamJoinOne.id);
    await this.logsService.createLog(EntityName.TeamJoin, teamJoin);

    // Custom logic
    return data.insertTeamJoinOne;
  }

  async findTeamJoin(
    selectionSet: string[],
    where: TeamJoinBoolExp,
    orderBy?: Array<TeamJoinOrderBy>,
    distinctOn?: Array<TeamJoinSelectColumn>,
    limit?: number,
    offset?: number,
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

  async insertTeamJoin(selectionSet: string[], objects: Array<TeamJoinInsertInput>, onConflict?: TeamJoinOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamJoin.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertTeamJoin', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeamJoin.returning) {
      const teamJoin = await this.teamJoinRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TeamJoin, teamJoin);
    }

    // Custom logic
    return data.insertTeamJoin;
  }

  async updateTeamJoinMany(selectionSet: string[], updates: Array<TeamJoinUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teamJoins = await this.teamJoinRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const teamJoin = teamJoins.find((teamJoin) => teamJoin.id === update.where.id._eq);
        if (!teamJoin) throw new NotFoundException(`TeamJoin (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, teamJoin);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update TeamJoin (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTeamJoinMany', selectionSet, updates);

    await Promise.all(
      teamJoins.map(async (teamJoin) => {
        const update = updates.find((update) => update.where.id._eq === teamJoin.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TeamJoin, teamJoin, update._set);
      }),
    );

    // Custom logic
    return data.updateTeamJoinMany;
  }

  async updateTeamJoinByPk(selectionSet: string[], pkColumns: TeamJoinPkColumnsInput, _set: TeamJoinSetInput) {
    const teamJoin = await this.teamJoinRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, teamJoin);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamJoin (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamJoinByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamJoin, teamJoin, _set);

    // Custom logic
    return data.updateTeamJoinByPk;
  }

  async deleteTeamJoin(selectionSet: string[], where: TeamJoinBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teamJoins = await this.teamJoinRepository.findByIds(where.id._in);

    await Promise.all(
      teamJoins.map(async (teamJoin) => {
        const canDelete = await this.checkPermsDelete(teamJoin);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamJoin (${teamJoin.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTeamJoin', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teamJoins.map(async (teamJoin) => {
        await this.logsService.deleteLog(EntityName.TeamJoin, teamJoin.id);
      }),
    );

    // Custom logic
    return data.updateTeamJoin;
  }

  async deleteTeamJoinByPk(selectionSet: string[], id: string) {
    const teamJoin = await this.teamJoinRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(teamJoin);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamJoin (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTeamJoinByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.TeamJoin, id);
    // Custom logic
    return data.updateTeamJoinByPk;
  }

  async aggregateTeamJoin(
    selectionSet: string[],
    where: TeamJoinBoolExp,
    orderBy?: Array<TeamJoinOrderBy>,
    distinctOn?: Array<TeamJoinSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamJoinAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamJoinAggregate;
  }
}
