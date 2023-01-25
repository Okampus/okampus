import { Field, ObjectType } from '@nestjs/graphql';
import { ITag, ITenantCore } from '@okampus/shared/dtos';
import { Colors } from '@okampus/shared/enums';
import { Paginated } from '../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { ActorModel } from '../abstract/actor.model';
import { TenantScopedModel } from '../abstract/tenant-scoped.model';

@ObjectType()
export class TagModel extends TenantScopedModel implements ITag {
  @Field(() => ActorModel)
  name!: string;

  @Field(() => Colors)
  color!: Colors;

  @Field(() => String, { nullable: true })
  description!: string | null;

  constructor(tag: ITag) {
    super(tag.tenant as ITenantCore);
    this.assign(tag);
  }
}

@ObjectType()
export class PaginatedTagModel extends Paginated(TagModel) {}
