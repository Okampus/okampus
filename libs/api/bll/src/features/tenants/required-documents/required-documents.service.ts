import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { RequiredDocumentRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { RequiredDocument } from '@okampus/api/dal';
import type {
  RequiredDocumentInsertInput,
  RequiredDocumentOnConflict,
  RequiredDocumentBoolExp,
  RequiredDocumentOrderBy,
  RequiredDocumentSelectColumn,
  RequiredDocumentSetInput,
  RequiredDocumentUpdates,
  RequiredDocumentPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class RequiredDocumentsService extends RequestContext {
  private readonly logger = new Logger(RequiredDocumentsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly requiredDocumentRepository: RequiredDocumentRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: RequiredDocumentInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(requiredDocument: RequiredDocument) {
    if (requiredDocument.deletedAt)
      throw new NotFoundException(`RequiredDocument was deleted on ${requiredDocument.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canDeleteTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: RequiredDocumentSetInput, requiredDocument: RequiredDocument) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (requiredDocument.deletedAt)
      throw new NotFoundException(`RequiredDocument was deleted on ${requiredDocument.deletedAt}.`);
    if (requiredDocument.hiddenAt)
      throw new NotFoundException('RequiredDocument must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return requiredDocument.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: RequiredDocumentSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: RequiredDocumentInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertRequiredDocumentOne(
    selectionSet: string[],
    object: RequiredDocumentInsertInput,
    onConflict?: RequiredDocumentOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert RequiredDocument.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertRequiredDocumentOne', selectionSet, object, onConflict);

    const requiredDocument = await this.requiredDocumentRepository.findOneOrFail(data.insertRequiredDocumentOne.id);
    await this.logsService.createLog(EntityName.RequiredDocument, requiredDocument);

    // Custom logic
    return data.insertRequiredDocumentOne;
  }

  async findRequiredDocument(
    selectionSet: string[],
    where: RequiredDocumentBoolExp,
    orderBy?: Array<RequiredDocumentOrderBy>,
    distinctOn?: Array<RequiredDocumentSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'requiredDocument',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.requiredDocument;
  }

  async findRequiredDocumentByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('requiredDocumentByPk', selectionSet, { id });
    return data.requiredDocumentByPk;
  }

  async insertRequiredDocument(
    selectionSet: string[],
    objects: Array<RequiredDocumentInsertInput>,
    onConflict?: RequiredDocumentOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert RequiredDocument.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertRequiredDocument', selectionSet, objects, onConflict);

    for (const inserted of data.insertRequiredDocument.returning) {
      const requiredDocument = await this.requiredDocumentRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.RequiredDocument, requiredDocument);
    }

    // Custom logic
    return data.insertRequiredDocument;
  }

  async updateRequiredDocumentMany(selectionSet: string[], updates: Array<RequiredDocumentUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const requiredDocuments = await this.requiredDocumentRepository.findByIds(
      updates.map((update) => update.where.id._eq),
    );

    await Promise.all(
      updates.map(async (update) => {
        const requiredDocument = requiredDocuments.find(
          (requiredDocument) => requiredDocument.id === update.where.id._eq,
        );
        if (!requiredDocument) throw new NotFoundException(`RequiredDocument (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, requiredDocument);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update RequiredDocument (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateRequiredDocumentMany', selectionSet, updates);

    await Promise.all(
      requiredDocuments.map(async (requiredDocument) => {
        const update = updates.find((update) => update.where.id._eq === requiredDocument.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.RequiredDocument, requiredDocument, update._set);
      }),
    );

    // Custom logic
    return data.updateRequiredDocumentMany;
  }

  async updateRequiredDocumentByPk(
    selectionSet: string[],
    pkColumns: RequiredDocumentPkColumnsInput,
    _set: RequiredDocumentSetInput,
  ) {
    const requiredDocument = await this.requiredDocumentRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, requiredDocument);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update RequiredDocument (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateRequiredDocumentByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.RequiredDocument, requiredDocument, _set);

    // Custom logic
    return data.updateRequiredDocumentByPk;
  }

  async deleteRequiredDocument(selectionSet: string[], where: RequiredDocumentBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const requiredDocuments = await this.requiredDocumentRepository.findByIds(where.id._in);

    await Promise.all(
      requiredDocuments.map(async (requiredDocument) => {
        const canDelete = await this.checkPermsDelete(requiredDocument);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete RequiredDocument (${requiredDocument.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateRequiredDocument', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      requiredDocuments.map(async (requiredDocument) => {
        await this.logsService.deleteLog(EntityName.RequiredDocument, requiredDocument.id);
      }),
    );

    // Custom logic
    return data.updateRequiredDocument;
  }

  async deleteRequiredDocumentByPk(selectionSet: string[], id: string) {
    const requiredDocument = await this.requiredDocumentRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(requiredDocument);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete RequiredDocument (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateRequiredDocumentByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.RequiredDocument, id);
    // Custom logic
    return data.updateRequiredDocumentByPk;
  }

  async aggregateRequiredDocument(
    selectionSet: string[],
    where: RequiredDocumentBoolExp,
    orderBy?: Array<RequiredDocumentOrderBy>,
    distinctOn?: Array<RequiredDocumentSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'requiredDocumentAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.requiredDocumentAggregate;
  }
}
