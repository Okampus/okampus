import { ActorImageModel } from './actor-image.model';
import { BaseFactory } from '../../base.factory';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { ActorImage } from '@okampus/api/dal';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageRepository } from '@okampus/api/dal';

import type { TenantCore, ImageUpload, Actor, ActorImageOptions } from '@okampus/api/dal';
import type { IActorImage } from '@okampus/shared/dtos';

@Injectable()
export class ActorImageFactory extends BaseFactory<ActorImageModel, ActorImage, IActorImage, ActorImageOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, actorImageRepository: ActorImageRepository) {
    super(ep, actorImageRepository, ActorImageModel, ActorImage);
  }

  modelToEntity(model: Required<ActorImageModel>): ActorImage {
    return new ActorImage({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      actor: { id: model.actor.id } as Actor,
      image: { id: model.image.id } as ImageUpload,
    });
  }
}
