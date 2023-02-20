import { DocumentEditModel } from './document-edit.model';
import { DocumentUploadModel } from './document-upload.model';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { UgcModel } from '../../abstract/ugc.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UgcKind } from '@okampus/shared/enums';
import type { IDocumentEdit, IDocumentUpload, ITenantDocument } from '@okampus/shared/dtos';

@ObjectType()
export class DocumentModel extends UgcModel implements ITenantDocument {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => Int, { nullable: true })
  yearVersion!: number | null;

  @Field(() => DocumentUploadModel)
  documentUpload!: IDocumentUpload;

  @Field(() => [DocumentEditModel])
  edits!: IDocumentEdit[];

  constructor(document: ITenantDocument) {
    super(document);
    this.assign(document);

    this.ugcKind = UgcKind.TenantDocument;
  }
}

@ObjectType()
export class PaginatedDocumentModel extends Paginated(DocumentModel) {}
