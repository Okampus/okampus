/* eslint-disable import/no-cycle */
import { FileUploadModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FileUploadKind } from '@okampus/shared/enums';
import type { IImageUpload } from '@okampus/shared/dtos';

@ObjectType({ implements: () => [FileUploadModel] })
export class ImageUploadModel extends FileUploadModel implements IImageUpload {
  @Field(() => Int, { nullable: true })
  width!: number | null;

  @Field(() => Int, { nullable: true })
  height!: number | null;

  constructor(image: IImageUpload) {
    super(image);
    this.assign(image);

    this.fileUploadKind = FileUploadKind.ImageUpload;
  }
}

@ObjectType()
export class PaginatedImageUploadModel extends Paginated(ImageUploadModel) {}
