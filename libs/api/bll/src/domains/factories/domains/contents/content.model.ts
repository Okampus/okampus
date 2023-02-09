import { Paginated } from '../../../../shards/types/paginated.type';
import { FileUploadModel } from '../../abstract/file-upload.model';
import { UgcModel } from '../../abstract/ugc.model';
import { ObjectType, Field } from '@nestjs/graphql';
import type { IContent, IFileUpload, IUgc } from '@okampus/shared/dtos';

@ObjectType({ implements: () => [UgcModel] })
export class ContentModel extends UgcModel implements IContent {
  @Field(() => [FileUploadModel])
  attachments!: IFileUpload[];

  @Field(() => UgcModel, { nullable: true })
  parent?: IUgc | null;

  constructor(content: IContent) {
    super(content);
    this.assign(content);
  }
}

@ObjectType()
export class PaginatedContentModel extends Paginated(ContentModel) {}
