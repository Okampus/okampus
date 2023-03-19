/* eslint-disable import/no-cycle */
import { DocumentUploadModel } from '../../index';
import { TenantScopedModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { IDocumentEdit, IDocumentUpload } from '@okampus/shared/dtos';

@ObjectType()
export class DocumentEditModel extends TenantScopedModel implements IDocumentEdit {
  @Field(() => Int, { nullable: true })
  yearVersion!: number | null;

  @Field(() => DocumentUploadModel)
  newVersion!: IDocumentUpload;

  constructor(document: IDocumentEdit) {
    if (!document.tenant) throw new Error('DocumentEdit must have a tenant');
    super(document.tenant);
  }
}

@ObjectType()
export class PaginatedDocumentEditModel extends Paginated(DocumentEditModel) {}
