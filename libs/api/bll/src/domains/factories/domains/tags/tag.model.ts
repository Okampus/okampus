import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { IndividualModel } from '../../abstract/individual.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { ImageUploadModel } from '../images/image-upload.model';
import { Colors, TagKind } from '@okampus/shared/enums';
import { Field, ObjectType } from '@nestjs/graphql';
import type { IImageUpload, IIndividual, ITag, ITenantCore } from '@okampus/shared/dtos';

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
    super(tag.tenant as ITenantCore);
    this.assign(tag);
  }
}

@ObjectType()
export class PaginatedTagModel extends Paginated(TagModel) {}
