/* eslint-disable import/no-cycle */
import { DocumentUploadModel, EditModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { IDocumentEdit, IDocumentUpload } from '@okampus/shared/dtos';

@ObjectType({ implements: () => [EditModel] })
export class DocumentEditModel extends EditModel implements IDocumentEdit {
  @Field(() => Int, { nullable: true })
  yearVersion!: number | null;

  @Field(() => DocumentUploadModel)
  newVersion!: IDocumentUpload;

  constructor(documentEdit: IDocumentEdit) {
    super(documentEdit);
    this.assign(documentEdit);
  }
}

@ObjectType()
export class PaginatedDocumentEditModel extends Paginated(DocumentEditModel) {}
