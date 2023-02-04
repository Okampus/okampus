import { Paginated } from '../../../../shards/types/paginated.type';
import { FileUploadModel } from '../../abstract/file-upload.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FileUploadKind } from '@okampus/shared/enums';
import type { IImageUpload } from '@okampus/shared/dtos';
// eslint-disable-next-line import/no-cycle

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
