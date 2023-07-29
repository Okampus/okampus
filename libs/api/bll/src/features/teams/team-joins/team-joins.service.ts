import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { TeamJoinRepository, TeamJoin } from '@okampus/api/dal';
import { EntityName, AdminPermissions, ApprovalState } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TeamJoinsService extends RequestContext {
  private readonly logger = new Logger(TeamJoinsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamJoinRepository: TeamJoinRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['TeamJoinInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(teamJoin: TeamJoin) {
    if (teamJoin.deletedAt) throw new NotFoundException(`TeamJoin was deleted on ${teamJoin.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === teamJoin.tenant?.id
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['TeamJoinSetInput'], teamJoin: TeamJoin) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamJoin.deletedAt) throw new NotFoundException(`TeamJoin was deleted on ${teamJoin.deletedAt}.`);
    if (teamJoin.hiddenAt) throw new NotFoundException('TeamJoin must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === teamJoin.tenant?.id
        )
    )
      return true;

    // Custom logic
    return teamJoin.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['TeamJoinSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    if (props.processedById) throw new BadRequestException('Cannot update processedById directly.');
    if (props.processedAt) throw new BadRequestException('Cannot update processedAt directly.');

    if (props.state === ApprovalState.Rejected || (props.state === ApprovalState.Approved && props.receivedRoleId)) {
      props.processedById = this.requester().id;
      props.processedAt = new Date().toISOString();
    }

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['TeamJoinInsertInput']) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTeamJoinOne(
    selectionSet: string[],
    object: ValueTypes['TeamJoinInsertInput'],
    onConflict?: ValueTypes['TeamJoinOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamJoin.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
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

  async insertTeamJoin(
    selectionSet: string[],
    objects: Array<ValueTypes['TeamJoinInsertInput']>,
    onConflict?: ValueTypes['TeamJoinOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamJoin.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertTeamJoin', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeamJoin.returning) {
      const teamJoin = await this.teamJoinRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TeamJoin, teamJoin);
    }

    // Custom logic
    return data.insertTeamJoin;
  }

  async updateTeamJoinMany(selectionSet: string[], updates: Array<ValueTypes['TeamJoinUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teamJoins = await this.teamJoinRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const teamJoin = teamJoins.find((teamJoin) => teamJoin.id === update.where.id._eq);
      if (!teamJoin) throw new NotFoundException(`TeamJoin (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, teamJoin);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamJoin (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateTeamJoinMany', selectionSet, updates);

    await Promise.all(
      teamJoins.map(async (teamJoin) => {
        const update = updates.find((update) => update.where.id._eq === teamJoin.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TeamJoin, teamJoin, update._set);
      })
    );

    // Custom logic
    return data.updateTeamJoinMany;
  }

  async updateTeamJoinByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TeamJoinPkColumnsInput'],
    _set: ValueTypes['TeamJoinSetInput']
  ) {
    const teamJoin = await this.teamJoinRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, teamJoin);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamJoin (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamJoinByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamJoin, teamJoin, _set);

    // Custom logic
    return data.updateTeamJoinByPk;
  }

  async deleteTeamJoin(selectionSet: string[], where: ValueTypes['TeamJoinBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teamJoins = await this.teamJoinRepository.findByIds(where.id._in);
    for (const teamJoin of teamJoins) {
      const canDelete = this.checkPermsDelete(teamJoin);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamJoin (${teamJoin.id}).`);
    }

    const data = await this.hasuraService.update('updateTeamJoin', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teamJoins.map(async (teamJoin) => {
        await this.logsService.deleteLog(EntityName.TeamJoin, teamJoin.id);
      })
    );

    // Custom logic
    return data.updateTeamJoin;
  }

  async deleteTeamJoinByPk(selectionSet: string[], pkColumns: ValueTypes['TeamJoinPkColumnsInput']) {
    const teamJoin = await this.teamJoinRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(teamJoin);
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
