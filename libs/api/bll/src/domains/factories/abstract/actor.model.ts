import { Field, ObjectType } from '@nestjs/graphql';
import type { IActor, IActorImage, IBot, ISocial, ITag, ITeam, ITenant, ITenantCore, IUser } from '@okampus/shared/dtos';
import { ActorKind } from '@okampus/shared/enums';
// eslint-disable-next-line import/no-cycle
import { ActorImageModel } from '../domains/images/actor-image.model';
// eslint-disable-next-line import/no-cycle
import { SocialModel } from '../domains/socials/social.model';
// eslint-disable-next-line import/no-cycle
import { TagModel } from '../domains/tags/tag.model';
import { TenantScopedModel } from './tenant-scoped.model';
// eslint-disable-next-line import/no-cycle
import { IndividualModel } from './individual.model';
// eslint-disable-next-line import/no-cycle
import { OrgModel } from './org.model';

@ObjectType()
export class ActorModel extends TenantScopedModel implements IActor {
  @Field(() => [TagModel])
  tags!: ITag[];

  @Field(() => ActorKind)
  actorKind!: ActorKind;

  @Field(() => IndividualModel, { nullable: true })
  individual?: IUser | IBot;

  @Field(() => OrgModel, { nullable: true })
  org?: ITeam | ITenant;

  @Field(() => String, { nullable: true })
  primaryEmail!: string | null;

  @Field(() => String)
  slug!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  bio!: string;

  @Field(() => String)
  ical!: string;

  @Field(() => [ActorImageModel])
  actorImages!: IActorImage[];

  @Field(() => [SocialModel])
  socials!: ISocial[];

  constructor(actor: IActor) {
    super(actor.tenant as ITenantCore);
    this.assign(actor);
  }
}
