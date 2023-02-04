import { Field, ObjectType } from '@nestjs/graphql';
import type { IImageUpload, ITag, ITenantCore } from '@okampus/shared/dtos';
import { Colors, TagKind } from '@okampus/shared/enums';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { IndividualModel } from '../../abstract/individual.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { ImageUploadModel } from '../images/image-upload.model';

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
  createdBy?: IndividualModel | null; // null for system

  constructor(tag: ITag) {
    super(tag.tenant as ITenantCore);
    this.assign(tag);
  }
}

@ObjectType()
export class PaginatedTagModel extends Paginated(TagModel) {}
