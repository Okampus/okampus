/* eslint-disable import/no-cycle */
import { DocumentEditModel } from '../../index';
import { DocumentUploadModel } from '../../index';
import { UgcModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UgcKind } from '@okampus/shared/enums';
import type { IDocumentEdit, IDocumentUpload, ITenantDocument } from '@okampus/shared/dtos';

@ObjectType()
export class DocumentModel extends UgcModel implements ITenantDocument {
  @Field(() => String)
  name!: string;

  @Field(() => Int, { nullable: true })
  yearVersion!: number | null;

  @Field(() => DocumentUploadModel)
  currentVersion!: IDocumentUpload;

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
