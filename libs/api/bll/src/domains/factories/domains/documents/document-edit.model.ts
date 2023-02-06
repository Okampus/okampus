import { DocumentUploadModel } from './document-upload.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { IDocumentEdit, IDocumentUpload, ITenantCore } from '@okampus/shared/dtos';

@ObjectType()
export class DocumentEditModel extends TenantScopedModel implements IDocumentEdit {
  @Field(() => Int, { nullable: true })
  yearVersion!: number | null;

  @Field(() => DocumentUploadModel)
  documentUpload!: IDocumentUpload;

  constructor(document: IDocumentEdit) {
    super(document.tenant as ITenantCore);
  }
}

@ObjectType()
export class PaginatedDocumentEditModel extends Paginated(DocumentEditModel) {}
