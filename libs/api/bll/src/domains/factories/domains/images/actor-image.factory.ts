import { ActorImageModel } from './actor-image.model';
import { BaseFactory } from '../../base.factory';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { ActorImage } from '@okampus/api/dal';
import type { TenantCore, ImageUpload, Actor, ActorImageRepository, ActorImageOptions } from '@okampus/api/dal';
import type { IActorImage } from '@okampus/shared/dtos';
// import { loadActorImage } from '../loader.utils';

@Injectable()
export class ActorImageFactory extends BaseFactory<ActorImageModel, ActorImage, IActorImage, ActorImageOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, actorImageRepository: ActorImageRepository) {
    super(ep, actorImageRepository, ActorImageModel, ActorImage);
  }

  // entityToModel(entity: ActorImage): ActorImageModel | undefined {
  //   const actorImage = loadActorImage(entity);
  //   if (!actorImage) return undefined;
  //   return this.createModel(actorImage);
  // }

  modelToEntity(model: Required<ActorImageModel>): ActorImage {
    return new ActorImage({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      actor: { id: model.actor.id } as Actor,
      image: { id: model.image.id } as ImageUpload,
    });
  }
}
