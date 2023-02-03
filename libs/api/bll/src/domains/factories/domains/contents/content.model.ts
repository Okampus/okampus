import { ObjectType, Field } from '@nestjs/graphql';
import { IContent, IFileUpload, IUgc } from '@okampus/shared/dtos';
import { Paginated } from '../../../../shards/types/paginated.type';
import { FileUploadModel } from '../../abstract/file-upload.model';
import { UgcModel } from '../../abstract/ugc.model';

@ObjectType({ implements: () => [UgcModel] })
export class ContentModel extends UgcModel implements IContent {
  @Field(() => String)
  text!: string;

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
