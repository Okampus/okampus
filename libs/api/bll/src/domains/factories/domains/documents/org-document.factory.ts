import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  OrgDocument,
  OrgDocumentOptions,
  OrgDocumentRepository,
  TenantCore,
  TenantDocument,
  Org,
  OrgRepository,
} from '@okampus/api/dal';
// eslint-disable-next-line import/no-cycle
import { BaseFactory } from '../../base.factory';
import { S3Buckets, DocumentKind, OrgDocumentType } from '@okampus/shared/enums';
import { addDocumentEditToDocument } from '../../abstract.utils';
import { UploadService } from '../../../../features/uploads/upload.service';
import { MulterFileType, Snowflake } from '@okampus/shared/types';
import { CreateDocumentDto, CreateOrgDocumentDto, IOrgDocument } from '@okampus/shared/dtos';
import { OrgDocumentModel } from './org-document.model';
// import { loadOrgDocument } from '../loader.utils';

@Injectable()
export class OrgDocumentFactory extends BaseFactory<OrgDocumentModel, OrgDocument, IOrgDocument, OrgDocumentOptions> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    private readonly orgDocumentRepository: OrgDocumentRepository,
    private readonly orgRepository: OrgRepository,
    private readonly uploadService: UploadService,
    OrgDocumentRepository: OrgDocumentRepository
  ) {
    super(ep, OrgDocumentRepository, OrgDocumentModel, OrgDocument);
  }

  async createOrgDocument(
    orgId: Snowflake,
    createOrgDocument: CreateOrgDocumentDto,
    documentFile: MulterFileType,
    tenant: TenantCore
  ): Promise<OrgDocumentModel> {
    const documentUpload = await this.uploadService.createDocumentUpload(tenant, documentFile, S3Buckets.OrgDocuments);

    const orgPopulate = (this.autoGqlPopulate()
      ?.filter((str: string) => str.startsWith(`org.`))
      ?.map((str: string) => str.replace(`org.`, '')) ?? ['shortcuts']) as never[];

    const org = await this.orgRepository.findOneOrFail({ id: orgId }, { populate: orgPopulate });

    const { type, ...createDocument } = createOrgDocument;

    const document = new TenantDocument({
      ...createDocument,
      documentKind: DocumentKind.InfoDocument,
      documentUpload,
      realAuthor: this.requester(),
      tenant,
    });

    await addDocumentEditToDocument(
      document,
      createDocument,
      documentUpload,
      tenant,
      this.requester(),
      this.uploadService
    );

    const orgDocumentOptions = { org, document, tenant, type };
    const orgDocument = await this.create(orgDocumentOptions, async (orgDocument) => {
      org.documents.add(orgDocument);
      return orgDocument;
    });
    this.orgRepository.flush();

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
    // return this.m;
    // const document = await addDocumentEditToDocument(
    //   orgDocument.document,
    //   createEdit,
    //   newDocument,
    //   tenant,
    //   this.requester(),
    //   this.uploadService
    // );

    // orgDocument.document = document;
    // await this.orgDocumentRepository.flush();
  }

  // entityToModel(entity: OrgDocument): OrgDocumentModel | undefined {
  //   const step = loadOrgDocument(entity);
  //   if (!step) return undefined;
  //   return this.createModel(step);
  // }

  modelToEntity(model: Required<OrgDocumentModel>): OrgDocument {
    return new OrgDocument({
      type: model.type,
      org: { id: model.org.id } as Org,
      document: { id: model.document.id } as TenantDocument,
      tenant: { id: model.tenant.id } as TenantCore,
    });
  }
}
