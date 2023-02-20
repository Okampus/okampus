import { DocumentUploadModel } from './document-upload.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { IDocumentEdit, IDocumentUpload } from '@okampus/shared/dtos';

@ObjectType()
export class DocumentEditModel extends TenantScopedModel implements IDocumentEdit {
  @Field(() => Int, { nullable: true })
  yearVersion!: number | null;

  @Field(() => DocumentUploadModel)
  documentUpload!: IDocumentUpload;

  constructor(document: IDocumentEdit) {
    if (!document.tenant) throw new Error('DocumentEdit must have a tenant');
    super(document.tenant);
  }
}

@ObjectType()
export class PaginatedDocumentEditModel extends Paginated(DocumentEditModel) {}
