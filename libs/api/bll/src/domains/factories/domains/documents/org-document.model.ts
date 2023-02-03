import { Field, ObjectType } from '@nestjs/graphql';
import { TenantCore } from '@okampus/api/dal';
import { IOrg, IOrgDocument, ITenantDocument } from '@okampus/shared/dtos';
import { OrgDocumentType } from '@okampus/shared/enums';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { OrgModel } from '../../abstract/org.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { DocumentModel } from './document.model';

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
