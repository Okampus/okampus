/* eslint-disable import/no-cycle */
import { TenantScopedModel } from '../index';
import { IndividualModel } from '../index';
import { OrgModel } from '../index';
import { ActorImageModel } from '../index';
import { SocialModel } from '../index';
import { TagModel } from '../index';
import { ActorKind } from '@okampus/shared/enums';
import { Field, ObjectType } from '@nestjs/graphql';
import type { IActor, IActorImage, IBot, ISocial, ITag, ITeam, ITenant, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class ActorModel extends TenantScopedModel implements IActor {
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

  @Field(() => [TagModel])
  tags!: ITag[];

  @Field(() => [SocialModel])
  socials!: ISocial[];

  constructor(actor: IActor) {
    if (!actor.tenant) throw new Error('Actor must have a tenant');
    super(actor.tenant);
    this.assign(actor);
  }
}
