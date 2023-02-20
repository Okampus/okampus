// eslint-disable-next-line import/no-cycle
import { ActorModel } from '../../abstract/actor.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, ObjectType } from '@nestjs/graphql';
import { SocialType } from '@okampus/shared/enums';
import type { IActor, ISocial } from '@okampus/shared/dtos';

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
    if (!social.tenant) throw new Error('Social must have a tenant');
    super(social.tenant);
    Object.assign(social);
  }
}

@ObjectType()
export class PaginatedSocialModel extends Paginated(SocialModel) {}
