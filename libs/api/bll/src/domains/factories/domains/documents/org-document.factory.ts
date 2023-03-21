import { OrgDocumentModel } from '../../index';
import { BaseFactory } from '../../base.factory';
import { addDocumentEditToDocument } from '../../factory.utils';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { S3Buckets, DocumentKind } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Individual, OrgDocumentRepository, OrgRepository } from '@okampus/api/dal';
import { Org, OrgDocument, TenantDocument, TenantCore } from '@okampus/api/dal';

import type { OrgDocumentOptions } from '@okampus/api/dal';
import type { CreateDocumentDto, CreateOrgDocumentDto, IOrgDocument } from '@okampus/shared/dtos';
import type { OrgDocumentType } from '@okampus/shared/enums';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';

@Injectable()
export class OrgDocumentFactory extends BaseFactory<OrgDocumentModel, OrgDocument, IOrgDocument, OrgDocumentOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    uploadService: UploadService,
    OrgDocumentRepository: OrgDocumentRepository,
    private readonly em: EntityManager,
    private readonly orgDocumentRepository: OrgDocumentRepository,
    private readonly orgRepository: OrgRepository
  ) {
    super(eventPublisher, uploadService, OrgDocumentRepository, OrgDocumentModel, OrgDocument);
  }

  async createOrgDocument(
    orgId: Snowflake,
    createOrgDocument: CreateOrgDocumentDto,
    documentFile: MulterFileType,
    tenant: TenantCore
  ): Promise<OrgDocumentModel> {
    const createdBy = this.requester();

    const newVersion = await this.uploadService.createDocumentUpload(tenant, documentFile, S3Buckets.OrgDocuments);

    const orgPopulate = (this.autoGqlPopulate()
      ?.filter((str: string) => str.startsWith(`org.`))
      ?.map((str: string) => str.replace(`org.`, '')) ?? ['shortcuts']) as never[];

    const org = await this.orgRepository.findOneOrFail({ id: orgId }, { populate: orgPopulate });

    const { type, ...createDocument } = createOrgDocument;

    const document = new TenantDocument({
      ...createDocument,
      documentKind: DocumentKind.InfoDocument,
      newVersion,
      createdBy,
      tenant,
    });

    await addDocumentEditToDocument(document, createDocument, newVersion, tenant, createdBy, this.uploadService);

    const orgDocumentOptions = { org, document, type, createdBy, tenant };
    const orgDocument = await this.create(orgDocumentOptions, async (orgDocument) => {
      org.documents.add(orgDocument);
      return orgDocument;
    });
    await this.orgRepository.flush();

    return orgDocument;
  }

  async editOrgDocument(
    orgDocumentId: Snowflake,
    editDocument: Partial<CreateDocumentDto>, // OrgDocument type cannot be changed
    type: OrgDocumentType,
    newDocumentFile: MulterFileType,
    tenant: TenantCore,
    populate: never[]
  ): Promise<OrgDocumentModel> {
    const orgDocument = await this.orgDocumentRepository.findOneOrFail(orgDocumentId, { populate });

    await addDocumentEditToDocument(
      orgDocument.document,
      editDocument,
      newDocumentFile,
      tenant,
      this.requester(),
      this.uploadService
    );

    if (orgDocument.type !== type) orgDocument.type = type;
    await this.orgDocumentRepository.flush();

    const orgDocumentModel = this.entityToModel(orgDocument);
    if (!orgDocumentModel)
      throw new InternalServerErrorException(`Error converting org document ${orgDocumentId} to model`);

    return orgDocumentModel;
  }

  modelToEntity(model: Required<OrgDocumentModel>): OrgDocument {
    return new OrgDocument({
      type: model.type,
      org: this.em.getReference(Org, model.org.id),
      document: this.em.getReference(TenantDocument, model.document.id),
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
