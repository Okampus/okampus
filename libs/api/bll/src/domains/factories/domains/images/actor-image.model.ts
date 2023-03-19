/* eslint-disable import/no-cycle */
import { ImageUploadModel } from '../../index';
import { ActorModel } from '../../index';
import { TenantScopedModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { Field, ObjectType } from '@nestjs/graphql';
import { ActorImageType } from '@okampus/shared/enums';
import type { IActor, IActorImage, IImageUpload } from '@okampus/shared/dtos';

@ObjectType()
export class ActorImageModel extends TenantScopedModel implements IActorImage {
  @Field(() => ActorModel, { nullable: true })
  actor?: IActor;

  @Field(() => ImageUploadModel, { nullable: true })
  image?: IImageUpload;

  @Field(() => ActorImageType)
  type!: ActorImageType;

  @Field(() => Date, { nullable: true })
  lastActiveDate!: Date | null;

  constructor(actorImage: IActorImage) {
    if (!actorImage.tenant) throw new Error('ActorImage must have a tenant');
    super(actorImage.tenant);
    this.assign(actorImage);
  }
}

@ObjectType()
export class PaginatedActorImageModel extends Paginated(ActorImageModel) {}
