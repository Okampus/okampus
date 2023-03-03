import { ActorImageModel } from './actor-image.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageRepository } from '@okampus/api/dal';
import { ActorImage, TenantCore, ImageUpload, Actor } from '@okampus/api/dal';

import type { Snowflake } from '@okampus/shared/types';
import type { ActorImageOptions } from '@okampus/api/dal';
import type { IActorImage } from '@okampus/shared/dtos';
import type { ActorImageType } from '@okampus/shared/enums';

@Injectable()
export class ActorImageFactory extends BaseFactory<ActorImageModel, ActorImage, IActorImage, ActorImageOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    actorImageRepository: ActorImageRepository,
    uploadService: UploadService,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, uploadService, actorImageRepository, ActorImageModel, ActorImage);
  }

  async deactivate(actorId: Snowflake, actorImageType: ActorImageType, populate: never[]): Promise<ActorImageModel> {
    return await this.update({ actor: { id: actorId }, type: actorImageType, lastActiveDate: null }, populate, {
      lastActiveDate: new Date(),
    });
  }

  modelToEntity(model: Required<ActorImageModel>): ActorImage {
    return new ActorImage({
      ...model,
      actor: this.em.getReference(Actor, model.actor.id),
      image: this.em.getReference(ImageUpload, model.image.id),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
