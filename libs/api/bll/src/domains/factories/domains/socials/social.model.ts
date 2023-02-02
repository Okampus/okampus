import { Field, ObjectType } from '@nestjs/graphql';
import { IActor, ISocial, ITenantCore } from '@okampus/shared/dtos';
import { SocialType } from '@okampus/shared/enums';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { ActorModel } from '../../abstract/actor.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';

@ObjectType()
export class SocialModel extends TenantScopedModel implements ISocial {
  @Field(() => ActorModel, { nullable: true })
  actor?: IActor;

  @Field(() => SocialType)
  type!: SocialType;

  @Field(() => String)
  url!: string;

  @Field(() => String)
  pseudo!: string;

  constructor(social: ISocial) {
    super(social.tenant as ITenantCore);
    Object.assign(social);
  }
}

@ObjectType()
export class PaginatedSocialModel extends Paginated(SocialModel) {}
