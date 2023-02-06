// eslint-disable-next-line import/no-cycle
import { DocumentModel } from './document.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { OrgModel } from '../../abstract/org.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { OrgDocumentType } from '@okampus/shared/enums';
import type { TenantCore } from '@okampus/api/dal';
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
    super(orgDocument.tenant as TenantCore);
    this.assign(orgDocument);
  }
}

@ObjectType()
export class PaginatedOrgDocumentModel extends Paginated(OrgDocumentModel) {}
