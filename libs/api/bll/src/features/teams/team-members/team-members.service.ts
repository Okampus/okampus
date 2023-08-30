import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TeamMemberRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TeamMember } from '@okampus/api/dal';
import type {
  TeamMemberInsertInput,
  TeamMemberOnConflict,
  TeamMemberBoolExp,
  TeamMemberOrderBy,
  TeamMemberSelectColumn,
  TeamMemberSetInput,
  TeamMemberUpdates,
  TeamMemberPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TeamMembersService extends RequestContext {
  private readonly logger = new Logger(TeamMembersService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamMemberRepository: TeamMemberRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TeamMemberInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenant: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(teamMember: TeamMember) {
    if (teamMember.deletedAt) throw new NotFoundException(`TeamMember was deleted on ${teamMember.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, teamMember))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TeamMemberSetInput, teamMember: TeamMember) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamMember.deletedAt) throw new NotFoundException(`TeamMember was deleted on ${teamMember.deletedAt}.`);
    if (teamMember.hiddenAt) throw new NotFoundException('TeamMember must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, teamMember))) return true;

    // Custom logic
    return teamMember.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TeamMemberSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TeamMemberInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTeamMemberOne(selectionSet: string[], object: TeamMemberInsertInput, onConflict?: TeamMemberOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamMember.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTeamMemberOne', selectionSet, object, onConflict);

    const teamMember = await this.teamMemberRepository.findOneOrFail(data.insertTeamMemberOne.id);
    await this.logsService.createLog(EntityName.TeamMember, teamMember);

    // Custom logic
    return data.insertTeamMemberOne;
  }

  async findTeamMember(
    selectionSet: string[],
    where: TeamMemberBoolExp,
    orderBy?: Array<TeamMemberOrderBy>,
    distinctOn?: Array<TeamMemberSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('teamMember', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.teamMember;
  }

  async findTeamMemberByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamMemberByPk', selectionSet, { id });
    return data.teamMemberByPk;
  }

  async insertTeamMember(
    selectionSet: string[],
    objects: Array<TeamMemberInsertInput>,
    onConflict?: TeamMemberOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamMember.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertTeamMember', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeamMember.returning) {
      const teamMember = await this.teamMemberRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TeamMember, teamMember);
    }

    // Custom logic
    return data.insertTeamMember;
  }

  async updateTeamMemberMany(selectionSet: string[], updates: Array<TeamMemberUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teamMembers = await this.teamMemberRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const teamMember = teamMembers.find((teamMember) => teamMember.id === update.where.id._eq);
        if (!teamMember) throw new NotFoundException(`TeamMember (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, teamMember);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update TeamMember (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTeamMemberMany', selectionSet, updates);

    await Promise.all(
      teamMembers.map(async (teamMember) => {
        const update = updates.find((update) => update.where.id._eq === teamMember.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TeamMember, teamMember, update._set);
      }),
    );

    // Custom logic
    return data.updateTeamMemberMany;
  }

  async updateTeamMemberByPk(selectionSet: string[], pkColumns: TeamMemberPkColumnsInput, _set: TeamMemberSetInput) {
    const teamMember = await this.teamMemberRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, teamMember);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamMember (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamMemberByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamMember, teamMember, _set);

    // Custom logic
    return data.updateTeamMemberByPk;
  }

  async deleteTeamMember(selectionSet: string[], where: TeamMemberBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teamMembers = await this.teamMemberRepository.findByIds(where.id._in);

    await Promise.all(
      teamMembers.map(async (teamMember) => {
        const canDelete = await this.checkPermsDelete(teamMember);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamMember (${teamMember.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTeamMember', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teamMembers.map(async (teamMember) => {
        await this.logsService.deleteLog(EntityName.TeamMember, teamMember.id);
      }),
    );

    // Custom logic
    return data.updateTeamMember;
  }

  async deleteTeamMemberByPk(selectionSet: string[], id: string) {
    const teamMember = await this.teamMemberRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(teamMember);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamMember (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTeamMemberByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.TeamMember, id);
    // Custom logic
    return data.updateTeamMemberByPk;
  }

  async aggregateTeamMember(
    selectionSet: string[],
    where: TeamMemberBoolExp,
    orderBy?: Array<TeamMemberOrderBy>,
    distinctOn?: Array<TeamMemberSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamMemberAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamMemberAggregate;
  }
}
