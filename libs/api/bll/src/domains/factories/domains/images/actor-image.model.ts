import { Field, ObjectType } from '@nestjs/graphql';
import type { IActor, IActorImage, IImageUpload, ITenantCore } from '@okampus/shared/dtos';
import { ActorImageType } from '@okampus/shared/enums';
import { Paginated } from '../../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { ActorModel } from '../../abstract/actor.model';
// eslint-disable-next-line import/no-cycle
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { ImageUploadModel } from './image-upload.model';

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
    super(actorImage.tenant as ITenantCore);
    this.assign(actorImage);
  }
}

@ObjectType()
export class PaginatedActorImageModel extends Paginated(ActorImageModel) {}
