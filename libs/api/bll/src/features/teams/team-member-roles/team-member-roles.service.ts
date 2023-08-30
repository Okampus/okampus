import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TeamMemberRoleRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TeamMemberRole } from '@okampus/api/dal';
import type {
  TeamMemberRoleInsertInput,
  TeamMemberRoleOnConflict,
  TeamMemberRoleBoolExp,
  TeamMemberRoleOrderBy,
  TeamMemberRoleSelectColumn,
  TeamMemberRoleSetInput,
  TeamMemberRoleUpdates,
  TeamMemberRolePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TeamMemberRolesService extends RequestContext {
  private readonly logger = new Logger(TeamMemberRolesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamMemberRoleRepository: TeamMemberRoleRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TeamMemberRoleInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenant: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(teamMemberRole: TeamMemberRole) {
    if (teamMemberRole.deletedAt)
      throw new NotFoundException(`TeamMemberRole was deleted on ${teamMemberRole.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, teamMemberRole))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TeamMemberRoleSetInput, teamMemberRole: TeamMemberRole) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamMemberRole.deletedAt)
      throw new NotFoundException(`TeamMemberRole was deleted on ${teamMemberRole.deletedAt}.`);
    if (teamMemberRole.hiddenAt)
      throw new NotFoundException('TeamMemberRole must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, teamMemberRole))) return true;

    // Custom logic
    return teamMemberRole.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TeamMemberRoleSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TeamMemberRoleInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTeamMemberRoleOne(
    selectionSet: string[],
    object: TeamMemberRoleInsertInput,
    onConflict?: TeamMemberRoleOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamMemberRole.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTeamMemberRoleOne', selectionSet, object, onConflict);

    const teamMemberRole = await this.teamMemberRoleRepository.findOneOrFail(data.insertTeamMemberRoleOne.id);
    await this.logsService.createLog(EntityName.TeamMemberRole, teamMemberRole);

    // Custom logic
    return data.insertTeamMemberRoleOne;
  }

  async findTeamMemberRole(
    selectionSet: string[],
    where: TeamMemberRoleBoolExp,
    orderBy?: Array<TeamMemberRoleOrderBy>,
    distinctOn?: Array<TeamMemberRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'teamMemberRole',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamMemberRole;
  }

  async findTeamMemberRoleByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamMemberRoleByPk', selectionSet, { id });
    return data.teamMemberRoleByPk;
  }

  async insertTeamMemberRole(
    selectionSet: string[],
    objects: Array<TeamMemberRoleInsertInput>,
    onConflict?: TeamMemberRoleOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamMemberRole.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertTeamMemberRole', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeamMemberRole.returning) {
      const teamMemberRole = await this.teamMemberRoleRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TeamMemberRole, teamMemberRole);
    }

    // Custom logic
    return data.insertTeamMemberRole;
  }

  async updateTeamMemberRoleMany(selectionSet: string[], updates: Array<TeamMemberRoleUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teamMemberRoles = await this.teamMemberRoleRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const teamMemberRole = teamMemberRoles.find((teamMemberRole) => teamMemberRole.id === update.where.id._eq);
        if (!teamMemberRole) throw new NotFoundException(`TeamMemberRole (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, teamMemberRole);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update TeamMemberRole (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTeamMemberRoleMany', selectionSet, updates);

    await Promise.all(
      teamMemberRoles.map(async (teamMemberRole) => {
        const update = updates.find((update) => update.where.id._eq === teamMemberRole.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TeamMemberRole, teamMemberRole, update._set);
      }),
    );

    // Custom logic
    return data.updateTeamMemberRoleMany;
  }

  async updateTeamMemberRoleByPk(
    selectionSet: string[],
    pkColumns: TeamMemberRolePkColumnsInput,
    _set: TeamMemberRoleSetInput,
  ) {
    const teamMemberRole = await this.teamMemberRoleRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, teamMemberRole);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamMemberRole (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamMemberRoleByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamMemberRole, teamMemberRole, _set);

    // Custom logic
    return data.updateTeamMemberRoleByPk;
  }

  async deleteTeamMemberRole(selectionSet: string[], where: TeamMemberRoleBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teamMemberRoles = await this.teamMemberRoleRepository.findByIds(where.id._in);

    await Promise.all(
      teamMemberRoles.map(async (teamMemberRole) => {
        const canDelete = await this.checkPermsDelete(teamMemberRole);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete TeamMemberRole (${teamMemberRole.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTeamMemberRole', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teamMemberRoles.map(async (teamMemberRole) => {
        await this.logsService.deleteLog(EntityName.TeamMemberRole, teamMemberRole.id);
      }),
    );

    // Custom logic
    return data.updateTeamMemberRole;
  }

  async deleteTeamMemberRoleByPk(selectionSet: string[], id: string) {
    const teamMemberRole = await this.teamMemberRoleRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(teamMemberRole);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamMemberRole (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTeamMemberRoleByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.TeamMemberRole, id);
    // Custom logic
    return data.updateTeamMemberRoleByPk;
  }

  async aggregateTeamMemberRole(
    selectionSet: string[],
    where: TeamMemberRoleBoolExp,
    orderBy?: Array<TeamMemberRoleOrderBy>,
    distinctOn?: Array<TeamMemberRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamMemberRoleAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamMemberRoleAggregate;
  }
}
