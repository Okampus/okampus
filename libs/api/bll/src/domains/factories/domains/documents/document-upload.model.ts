import { Paginated } from '../../../../shards/types/paginated.type';
import { FileUploadModel } from '../../abstract/file-upload.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DocumentUploadType, FileUploadKind } from '@okampus/shared/enums';
import type { IDocumentUpload } from '@okampus/shared/dtos';
// eslint-disable-next-line import/no-cycle

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

    this.numberOfPages = document.numberOfPages;
    this.numberOfWords = document.numberOfWords;
    this.documentType = document.documentType;

    this.fileUploadKind = FileUploadKind.DocumentUpload;
  }
}

@ObjectType()
export class PaginatedDocumentUploadModel extends Paginated(DocumentUploadModel) {}
