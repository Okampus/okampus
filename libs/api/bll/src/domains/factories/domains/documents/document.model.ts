import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { IDocumentEdit, IDocumentUpload, ITenantDocument } from '@okampus/shared/dtos';
import { UgcKind } from '@okampus/shared/enums';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { UgcModel } from '../../abstract/ugc.model';
import { DocumentEditModel } from './document-edit.model';
import { DocumentUploadModel } from './document-upload.model';

@ObjectType()
export class DocumentModel extends UgcModel implements ITenantDocument {
  @Field(() => String)
  name!: string;

  @Field(() => Int, { nullable: true })
  yearVersion!: number | null;

  @Field(() => DocumentUploadModel)
  documentUpload!: IDocumentUpload;

  @Field(() => [DocumentEditModel])
  edits!: IDocumentEdit[];

  constructor(document: ITenantDocument) {
    super(document);
    this.ugcKind = UgcKind.TenantDocument;
  }
}

@ObjectType()
export class PaginatedDocumentModel extends Paginated(DocumentModel) {}
