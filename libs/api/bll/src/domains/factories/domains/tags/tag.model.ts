import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { IndividualModel } from '../../index';
import { TenantScopedModel } from '../../index';
import { ImageUploadModel } from '../../index';
import { Colors, TagKind } from '@okampus/shared/enums';
import { Field, ObjectType } from '@nestjs/graphql';
import type { IImageUpload, IIndividual, ITag } from '@okampus/shared/dtos';

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

  @Field(() => IndividualModel, { nullable: true })
  createdBy?: IIndividual | null; // null for system

  constructor(tag: ITag) {
    if (!tag.tenant) throw new Error('Tag must have a tenant');
    super(tag.tenant);
    this.assign(tag);
  }
}

@ObjectType()
export class PaginatedTagModel extends Paginated(TagModel) {}
