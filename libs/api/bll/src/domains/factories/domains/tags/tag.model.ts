// eslint-disable-next-line import/no-cycle
import { ImageUploadModel, TenantScopedModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, ObjectType } from '@nestjs/graphql';
import { Colors, TagKind } from '@okampus/shared/enums';
import type { IImageUpload, ITag } from '@okampus/shared/dtos';

@ObjectType()
export class TagModel extends TenantScopedModel implements ITag {
  @Field(() => TagKind)
  tagKind!: TagKind;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => Colors)
  color!: Colors;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => ImageUploadModel, { nullable: true })
  iconImage?: IImageUpload | null;

  constructor(tag: ITag) {
    if (!tag.tenant) throw new Error('Tag must have a tenant');
    super(tag.tenant);
    this.assign(tag);
  }
}

@ObjectType()
export class PaginatedTagModel extends Paginated(TagModel) {}
