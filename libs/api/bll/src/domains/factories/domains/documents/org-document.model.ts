// eslint-disable-next-line import/no-cycle
import { DocumentModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { OrgModel } from '../../index';
import { TenantScopedModel } from '../../index';
import { Field, ObjectType } from '@nestjs/graphql';
import { OrgDocumentType } from '@okampus/shared/enums';
import type { IOrg, IOrgDocument, ITenantDocument } from '@okampus/shared/dtos';

@ObjectType()
export class OrgDocumentModel extends TenantScopedModel implements IOrgDocument {
  @Field(() => OrgModel)
  org!: IOrg;

  @Field(() => DocumentModel)
  document?: ITenantDocument;

  @Field(() => OrgDocumentType)
  type!: OrgDocumentType;

  constructor(orgDocument: IOrgDocument) {
    if (!orgDocument.tenant) throw new Error('OrgDocument must have a tenant');
    super(orgDocument.tenant);
    this.assign(orgDocument);
  }
}

@ObjectType()
export class PaginatedOrgDocumentModel extends Paginated(OrgDocumentModel) {}
