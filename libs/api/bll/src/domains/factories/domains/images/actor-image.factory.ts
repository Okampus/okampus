import { ActorImageModel } from '../../index';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageRepository, Individual } from '@okampus/api/dal';
import { ActorImage, TenantCore, ImageUpload, Actor } from '@okampus/api/dal';

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

  async deactivate(
    actorFilter: FilterQuery<Actor>,
    actorImageType: ActorImageType,
    tenant: TenantCore,
    populate: never[],
    force?: boolean
  ): Promise<ActorImageModel> {
    const where = { actor: actorFilter, type: actorImageType, lastActiveDate: null, tenant };
    const actorImageModel = await this.update(where, populate, { lastActiveDate: new Date() }, force);

    if (actorImageModel.actor?.actorImages) {
      const notCurrentImage = (image: IActorImage) => !image.lastActiveDate;
      actorImageModel.actor.actorImages = actorImageModel.actor.actorImages.filter(notCurrentImage);
    }

    return actorImageModel;
  }

  modelToEntity(model: Required<ActorImageModel>): ActorImage {
    return new ActorImage({
      ...model,
      actor: this.em.getReference(Actor, model.actor.id),
      image: this.em.getReference(ImageUpload, model.image.id),
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
