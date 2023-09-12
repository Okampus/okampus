import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TeamRoleRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TeamRole } from '@okampus/api/dal';
import type {
  TeamRoleInsertInput,
  TeamRoleOnConflict,
  TeamRoleBoolExp,
  TeamRoleOrderBy,
  TeamRoleSelectColumn,
  TeamRoleSetInput,
  TeamRoleUpdates,
  TeamRolePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TeamRolesService extends RequestContext {
  private readonly logger = new Logger(TeamRolesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamRoleRepository: TeamRoleRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TeamRoleInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return false;
  }

  async checkPermsDelete(teamRole: TeamRole) {
    if (teamRole.deletedAt) throw new NotFoundException(`TeamRole was deleted on ${teamRole.deletedAt}.`);

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TeamRoleSetInput, teamRole: TeamRole) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamRole.deletedAt) throw new NotFoundException(`TeamRole was deleted on ${teamRole.deletedAt}.`);

    // Custom logic
    return teamRole.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TeamRoleSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TeamRoleInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    return true;
  }

  async insertTeamRoleOne(selectionSet: string[], object: TeamRoleInsertInput, onConflict?: TeamRoleOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamRole.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTeamRoleOne', selectionSet, object, onConflict);

    const teamRole = await this.teamRoleRepository.findOneOrFail(data.insertTeamRoleOne.id);
    await this.logsService.createLog(EntityName.TeamRole, teamRole);

    // Custom logic
    return data.insertTeamRoleOne;
  }

  async findTeamRole(
    selectionSet: string[],
    where: TeamRoleBoolExp,
    orderBy?: Array<TeamRoleOrderBy>,
    distinctOn?: Array<TeamRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('teamRole', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.teamRole;
  }

  async findTeamRoleByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamRoleByPk', selectionSet, { id });
    return data.teamRoleByPk;
  }

  async insertTeamRole(selectionSet: string[], objects: Array<TeamRoleInsertInput>, onConflict?: TeamRoleOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamRole.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertTeamRole', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeamRole.returning) {
      const teamRole = await this.teamRoleRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TeamRole, teamRole);
    }

    // Custom logic
    return data.insertTeamRole;
  }

  async updateTeamRoleMany(selectionSet: string[], updates: Array<TeamRoleUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teamRoles = await this.teamRoleRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const teamRole = teamRoles.find((teamRole) => teamRole.id === update.where.id._eq);
        if (!teamRole) throw new NotFoundException(`TeamRole (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, teamRole);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update TeamRole (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTeamRoleMany', selectionSet, updates);

    await Promise.all(
      teamRoles.map(async (teamRole) => {
        const update = updates.find((update) => update.where.id._eq === teamRole.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TeamRole, teamRole, update._set);
      }),
    );

    // Custom logic
    return data.updateTeamRoleMany;
  }

  async updateTeamRoleByPk(selectionSet: string[], pkColumns: TeamRolePkColumnsInput, _set: TeamRoleSetInput) {
    const teamRole = await this.teamRoleRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, teamRole);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamRole (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamRoleByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamRole, teamRole, _set);

    // Custom logic
    return data.updateTeamRoleByPk;
  }

  async deleteTeamRole(selectionSet: string[], where: TeamRoleBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teamRoles = await this.teamRoleRepository.findByIds(where.id._in);

    await Promise.all(
      teamRoles.map(async (teamRole) => {
        const canDelete = await this.checkPermsDelete(teamRole);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamRole (${teamRole.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTeamRole', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teamRoles.map(async (teamRole) => {
        await this.logsService.deleteLog(EntityName.TeamRole, teamRole.id);
      }),
    );

    // Custom logic
    return data.updateTeamRole;
  }

  async deleteTeamRoleByPk(selectionSet: string[], id: string) {
    const teamRole = await this.teamRoleRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(teamRole);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamRole (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTeamRoleByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.TeamRole, id);
    // Custom logic
    return data.updateTeamRoleByPk;
  }

  async aggregateTeamRole(
    selectionSet: string[],
    where: TeamRoleBoolExp,
    orderBy?: Array<TeamRoleOrderBy>,
    distinctOn?: Array<TeamRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamRoleAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamRoleAggregate;
  }
}
