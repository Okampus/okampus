import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TeamRequiredRoleRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TeamRequiredRole } from '@okampus/api/dal';
import type {
  TeamRequiredRoleInsertInput,
  TeamRequiredRoleOnConflict,
  TeamRequiredRoleBoolExp,
  TeamRequiredRoleOrderBy,
  TeamRequiredRoleSelectColumn,
  TeamRequiredRoleSetInput,
  TeamRequiredRoleUpdates,
  TeamRequiredRolePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TeamRequiredRolesService extends RequestContext {
  private readonly logger = new Logger(TeamRequiredRolesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamRequiredRoleRepository: TeamRequiredRoleRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TeamRequiredRoleInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return false;
  }

  async checkPermsDelete(teamRequiredRole: TeamRequiredRole) {
    if (teamRequiredRole.deletedAt)
      throw new NotFoundException(`TeamRequiredRole was deleted on ${teamRequiredRole.deletedAt}.`);

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TeamRequiredRoleSetInput, teamRequiredRole: TeamRequiredRole) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamRequiredRole.deletedAt)
      throw new NotFoundException(`TeamRequiredRole was deleted on ${teamRequiredRole.deletedAt}.`);

    // Custom logic
    return teamRequiredRole.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TeamRequiredRoleSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TeamRequiredRoleInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    return true;
  }

  async insertTeamRequiredRoleOne(
    selectionSet: string[],
    object: TeamRequiredRoleInsertInput,
    onConflict?: TeamRequiredRoleOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamRequiredRole.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTeamRequiredRoleOne', selectionSet, object, onConflict);

    const teamRequiredRole = await this.teamRequiredRoleRepository.findOneOrFail(data.insertTeamRequiredRoleOne.id);
    await this.logsService.createLog(EntityName.TeamRequiredRole, teamRequiredRole);

    // Custom logic
    return data.insertTeamRequiredRoleOne;
  }

  async findTeamRequiredRole(
    selectionSet: string[],
    where: TeamRequiredRoleBoolExp,
    orderBy?: Array<TeamRequiredRoleOrderBy>,
    distinctOn?: Array<TeamRequiredRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'teamRequiredRole',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamRequiredRole;
  }

  async findTeamRequiredRoleByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamRequiredRoleByPk', selectionSet, { id });
    return data.teamRequiredRoleByPk;
  }

  async insertTeamRequiredRole(
    selectionSet: string[],
    objects: Array<TeamRequiredRoleInsertInput>,
    onConflict?: TeamRequiredRoleOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamRequiredRole.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertTeamRequiredRole', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeamRequiredRole.returning) {
      const teamRequiredRole = await this.teamRequiredRoleRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TeamRequiredRole, teamRequiredRole);
    }

    // Custom logic
    return data.insertTeamRequiredRole;
  }

  async updateTeamRequiredRoleMany(selectionSet: string[], updates: Array<TeamRequiredRoleUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teamRequiredRoles = await this.teamRequiredRoleRepository.findByIds(
      updates.map((update) => update.where.id._eq),
    );

    await Promise.all(
      updates.map(async (update) => {
        const teamRequiredRole = teamRequiredRoles.find(
          (teamRequiredRole) => teamRequiredRole.id === update.where.id._eq,
        );
        if (!teamRequiredRole) throw new NotFoundException(`TeamRequiredRole (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, teamRequiredRole);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update TeamRequiredRole (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTeamRequiredRoleMany', selectionSet, updates);

    await Promise.all(
      teamRequiredRoles.map(async (teamRequiredRole) => {
        const update = updates.find((update) => update.where.id._eq === teamRequiredRole.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TeamRequiredRole, teamRequiredRole, update._set);
      }),
    );

    // Custom logic
    return data.updateTeamRequiredRoleMany;
  }

  async updateTeamRequiredRoleByPk(
    selectionSet: string[],
    pkColumns: TeamRequiredRolePkColumnsInput,
    _set: TeamRequiredRoleSetInput,
  ) {
    const teamRequiredRole = await this.teamRequiredRoleRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, teamRequiredRole);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamRequiredRole (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamRequiredRoleByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamRequiredRole, teamRequiredRole, _set);

    // Custom logic
    return data.updateTeamRequiredRoleByPk;
  }

  async deleteTeamRequiredRole(selectionSet: string[], where: TeamRequiredRoleBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teamRequiredRoles = await this.teamRequiredRoleRepository.findByIds(where.id._in);

    await Promise.all(
      teamRequiredRoles.map(async (teamRequiredRole) => {
        const canDelete = await this.checkPermsDelete(teamRequiredRole);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete TeamRequiredRole (${teamRequiredRole.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTeamRequiredRole', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teamRequiredRoles.map(async (teamRequiredRole) => {
        await this.logsService.deleteLog(EntityName.TeamRequiredRole, teamRequiredRole.id);
      }),
    );

    // Custom logic
    return data.updateTeamRequiredRole;
  }

  async deleteTeamRequiredRoleByPk(selectionSet: string[], id: string) {
    const teamRequiredRole = await this.teamRequiredRoleRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(teamRequiredRole);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamRequiredRole (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTeamRequiredRoleByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.TeamRequiredRole, id);
    // Custom logic
    return data.updateTeamRequiredRoleByPk;
  }

  async aggregateTeamRequiredRole(
    selectionSet: string[],
    where: TeamRequiredRoleBoolExp,
    orderBy?: Array<TeamRequiredRoleOrderBy>,
    distinctOn?: Array<TeamRequiredRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamRequiredRoleAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamRequiredRoleAggregate;
  }
}
