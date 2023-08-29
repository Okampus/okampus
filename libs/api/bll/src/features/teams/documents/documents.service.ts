import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DocumentRepository, Document } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  DocumentInsertInput,
  DocumentOnConflict,
  DocumentBoolExp,
  DocumentOrderBy,
  DocumentSelectColumn,
  DocumentSetInput,
  DocumentUpdates,
  DocumentPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class DocumentsService extends RequestContext {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly documentRepository: DocumentRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: DocumentInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(document: Document) {
    if (document.deletedAt) throw new NotFoundException(`Document was deleted on ${document.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === document.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: DocumentSetInput, document: Document) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (document.deletedAt) throw new NotFoundException(`Document was deleted on ${document.deletedAt}.`);
    if (document.hiddenAt) throw new NotFoundException('Document must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === document.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return document.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: DocumentSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: DocumentInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertDocumentOne(selectionSet: string[], object: DocumentInsertInput, onConflict?: DocumentOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Document.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertDocumentOne', selectionSet, object, onConflict);

    const document = await this.documentRepository.findOneOrFail(data.insertDocumentOne.id);
    await this.logsService.createLog(EntityName.Document, document);

    // Custom logic
    return data.insertDocumentOne;
  }

  async findDocument(
    selectionSet: string[],
    where: DocumentBoolExp,
    orderBy?: Array<DocumentOrderBy>,
    distinctOn?: Array<DocumentSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('document', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.document;
  }

  async findDocumentByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('documentByPk', selectionSet, { id });
    return data.documentByPk;
  }

  async insertDocument(selectionSet: string[], objects: Array<DocumentInsertInput>, onConflict?: DocumentOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Document.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertDocument', selectionSet, objects, onConflict);

    for (const inserted of data.insertDocument.returning) {
      const document = await this.documentRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Document, document);
    }

    // Custom logic
    return data.insertDocument;
  }

  async updateDocumentMany(selectionSet: string[], updates: Array<DocumentUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const documents = await this.documentRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const document = documents.find((document) => document.id === update.where.id._eq);
        if (!document) throw new NotFoundException(`Document (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, document);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update Document (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateDocumentMany', selectionSet, updates);

    await Promise.all(
      documents.map(async (document) => {
        const update = updates.find((update) => update.where.id._eq === document.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Document, document, update._set);
      }),
    );

    // Custom logic
    return data.updateDocumentMany;
  }

  async updateDocumentByPk(selectionSet: string[], pkColumns: DocumentPkColumnsInput, _set: DocumentSetInput) {
    const document = await this.documentRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, document);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Document (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateDocumentByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Document, document, _set);

    // Custom logic
    return data.updateDocumentByPk;
  }

  async deleteDocument(selectionSet: string[], where: DocumentBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const documents = await this.documentRepository.findByIds(where.id._in);

    await Promise.all(
      documents.map(async (document) => {
        const canDelete = await this.checkPermsDelete(document);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Document (${document.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateDocument', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      documents.map(async (document) => {
        await this.logsService.deleteLog(EntityName.Document, document.id);
      }),
    );

    // Custom logic
    return data.updateDocument;
  }

  async deleteDocumentByPk(selectionSet: string[], id: string) {
    const document = await this.documentRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(document);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Document (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateDocumentByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Document, id);
    // Custom logic
    return data.updateDocumentByPk;
  }

  async aggregateDocument(
    selectionSet: string[],
    where: DocumentBoolExp,
    orderBy?: Array<DocumentOrderBy>,
    distinctOn?: Array<DocumentSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'documentAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.documentAggregate;
  }
}
