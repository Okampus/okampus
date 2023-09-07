import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TeamDocumentRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TeamDocument } from '@okampus/api/dal';
import type {
  TeamDocumentInsertInput,
  TeamDocumentOnConflict,
  TeamDocumentBoolExp,
  TeamDocumentOrderBy,
  TeamDocumentSelectColumn,
  TeamDocumentSetInput,
  TeamDocumentUpdates,
  TeamDocumentPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TeamDocumentsService extends RequestContext {
  private readonly logger = new Logger(TeamDocumentsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly teamDocumentRepository: TeamDocumentRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TeamDocumentInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(teamDocument: TeamDocument) {
    if (teamDocument.deletedAt) throw new NotFoundException(`TeamDocument was deleted on ${teamDocument.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canDeleteTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TeamDocumentSetInput, teamDocument: TeamDocument) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (teamDocument.deletedAt) throw new NotFoundException(`TeamDocument was deleted on ${teamDocument.deletedAt}.`);
    if (teamDocument.hiddenAt) throw new NotFoundException('TeamDocument must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return teamDocument.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TeamDocumentSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TeamDocumentInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTeamDocumentOne(
    selectionSet: string[],
    object: TeamDocumentInsertInput,
    onConflict?: TeamDocumentOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamDocument.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTeamDocumentOne', selectionSet, object, onConflict);

    const teamDocument = await this.teamDocumentRepository.findOneOrFail(data.insertTeamDocumentOne.id);
    await this.logsService.createLog(EntityName.TeamDocument, teamDocument);

    // Custom logic
    return data.insertTeamDocumentOne;
  }

  async findTeamDocument(
    selectionSet: string[],
    where: TeamDocumentBoolExp,
    orderBy?: Array<TeamDocumentOrderBy>,
    distinctOn?: Array<TeamDocumentSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('teamDocument', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.teamDocument;
  }

  async findTeamDocumentByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamDocumentByPk', selectionSet, { id });
    return data.teamDocumentByPk;
  }

  async insertTeamDocument(
    selectionSet: string[],
    objects: Array<TeamDocumentInsertInput>,
    onConflict?: TeamDocumentOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TeamDocument.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertTeamDocument', selectionSet, objects, onConflict);

    for (const inserted of data.insertTeamDocument.returning) {
      const teamDocument = await this.teamDocumentRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TeamDocument, teamDocument);
    }

    // Custom logic
    return data.insertTeamDocument;
  }

  async updateTeamDocumentMany(selectionSet: string[], updates: Array<TeamDocumentUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const teamDocuments = await this.teamDocumentRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const teamDocument = teamDocuments.find((teamDocument) => teamDocument.id === update.where.id._eq);
        if (!teamDocument) throw new NotFoundException(`TeamDocument (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, teamDocument);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update TeamDocument (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTeamDocumentMany', selectionSet, updates);

    await Promise.all(
      teamDocuments.map(async (teamDocument) => {
        const update = updates.find((update) => update.where.id._eq === teamDocument.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TeamDocument, teamDocument, update._set);
      }),
    );

    // Custom logic
    return data.updateTeamDocumentMany;
  }

  async updateTeamDocumentByPk(
    selectionSet: string[],
    pkColumns: TeamDocumentPkColumnsInput,
    _set: TeamDocumentSetInput,
  ) {
    const teamDocument = await this.teamDocumentRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, teamDocument);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TeamDocument (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTeamDocumentByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TeamDocument, teamDocument, _set);

    // Custom logic
    return data.updateTeamDocumentByPk;
  }

  async deleteTeamDocument(selectionSet: string[], where: TeamDocumentBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const teamDocuments = await this.teamDocumentRepository.findByIds(where.id._in);

    await Promise.all(
      teamDocuments.map(async (teamDocument) => {
        const canDelete = await this.checkPermsDelete(teamDocument);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete TeamDocument (${teamDocument.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTeamDocument', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      teamDocuments.map(async (teamDocument) => {
        await this.logsService.deleteLog(EntityName.TeamDocument, teamDocument.id);
      }),
    );

    // Custom logic
    return data.updateTeamDocument;
  }

  async deleteTeamDocumentByPk(selectionSet: string[], id: string) {
    const teamDocument = await this.teamDocumentRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(teamDocument);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TeamDocument (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTeamDocumentByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.TeamDocument, id);
    // Custom logic
    return data.updateTeamDocumentByPk;
  }

  async aggregateTeamDocument(
    selectionSet: string[],
    where: TeamDocumentBoolExp,
    orderBy?: Array<TeamDocumentOrderBy>,
    distinctOn?: Array<TeamDocumentSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamDocumentAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.teamDocumentAggregate;
  }
}
