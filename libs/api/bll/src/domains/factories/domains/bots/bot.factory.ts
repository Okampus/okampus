import { BotModel } from './bot.model';
import { BaseFactory } from '../../base.factory';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { addImagesToActor, extractActor } from '../../factory.utils';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageUploadProps, BotRepository } from '@okampus/api/dal';
import { Bot, TenantCore, Tag, Actor } from '@okampus/api/dal';

import type { BotOptions } from '@okampus/api/dal';
import type { IActorImage, IBot, UpdateBotDto } from '@okampus/shared/dtos';
import type { Populate } from '@mikro-orm/core';

@Injectable()
export class BotFactory extends BaseFactory<BotModel, Bot, IBot, BotOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    uploadService: UploadService,
    botRepository: BotRepository,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, uploadService, botRepository, BotModel, Bot);
  }

  async updateBot(
    updateBot: UpdateBotDto,
    tenant: TenantCore,
    populate: Populate<Bot>,
    actorImages?: ActorImageUploadProps
  ) {
    const { id, ...data } = updateBot;

    const transform = async (bot: Bot) => {
      if (actorImages)
        await addImagesToActor(bot.actor, bot.actor.actorKind(), actorImages, tenant, this.uploadService);
      return bot;
    };

    const transformModel = async (model: BotModel) => {
      if (actorImages && model.actor && model.actor.actorImages)
        model.actor.actorImages = model.actor.actorImages.filter((image: IActorImage) => !image.lastActiveDate);
      return model;
    };

    return await this.update({ id, tenant }, populate, extractActor(data), false, transform, transformModel);
  }

  modelToEntity(model: Required<BotModel>): Bot {
    return new Bot({
      bio: model.actor.bio,
      botRole: model.botRole,
      name: model.actor.name,
      primaryEmail: model.actor.primaryEmail,
      slug: model.actor.slug,
      tags: model.actor.tags.map((tag) => this.em.getReference(Tag, tag.id)),
      owner: this.em.getReference(Actor, model.owner.id),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
