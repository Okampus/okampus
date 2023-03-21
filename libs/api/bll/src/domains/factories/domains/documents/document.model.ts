// eslint-disable-next-line import/no-cycle
import { DocumentUploadModel, UgcModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UgcKind } from '@okampus/shared/enums';

import type { IDocumentUpload, ITenantDocument } from '@okampus/shared/dtos';

@ObjectType()
export class DocumentModel extends UgcModel implements ITenantDocument {
  @Field(() => String)
  name!: string;

  @Field(() => DocumentUploadModel)
  current!: IDocumentUpload;

  @Field(() => Int, { nullable: true })
  yearVersion!: number | null;

  constructor(document: ITenantDocument) {
    super(document);
    this.assign(document);

    this.ugcKind = UgcKind.TenantDocument;
  }
}

@ObjectType()
export class PaginatedDocumentModel extends Paginated(DocumentModel) {}
