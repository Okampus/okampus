import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IImageUpload } from '@okampus/shared/dtos';
import { FileUploadKind } from '@okampus/shared/enums';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { FileUploadModel } from '../../abstract/file-upload.model';

@ObjectType({ implements: () => [FileUploadModel] })
export class ImageUploadModel extends FileUploadModel implements IImageUpload {
  @Field(() => Int, { nullable: true })
  width!: number | null;

  @Field(() => Int, { nullable: true })
  height!: number | null;

  constructor(image: IImageUpload) {
    super(image);

    this.width = image.width;
    this.height = image.height;

    this.fileUploadKind = FileUploadKind.ImageUpload;
  }
}

@ObjectType()
export class PaginatedImageUploadModel extends Paginated(ImageUploadModel) {}
