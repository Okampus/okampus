/* eslint-disable import/no-cycle */
import { FileUploadModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DocumentUploadType, FileUploadKind } from '@okampus/shared/enums';
import type { IDocumentUpload } from '@okampus/shared/dtos';

@ObjectType({ implements: () => [FileUploadModel] })
export class DocumentUploadModel extends FileUploadModel implements IDocumentUpload {
  @Field(() => Int, { nullable: true })
  numberOfPages!: number | null;

  @Field(() => Int, { nullable: true })
  numberOfWords!: number | null;

  @Field(() => DocumentUploadType)
  documentType!: DocumentUploadType;

  constructor(document: IDocumentUpload) {
    super(document);
    this.assign(document);

    this.fileUploadKind = FileUploadKind.DocumentUpload;
  }
}

@ObjectType()
export class PaginatedDocumentUploadModel extends Paginated(DocumentUploadModel) {}
