import { BotModel } from '../../index';
import { BaseFactory } from '../../base.factory';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { addImagesToActor, separateActorProps } from '../../factory.utils';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorRepository, BotRepository } from '@okampus/api/dal';
import { Actor, Bot, Individual, TenantCore, Tag } from '@okampus/api/dal';
import { ActorKind } from '@okampus/shared/enums';

import type { BotOptions, ActorImageUploadProps } from '@okampus/api/dal';
import type { IActorImage, IBot, UpdateBotDto } from '@okampus/shared/dtos';
import type { Populate } from '@mikro-orm/core';

@Injectable()
export class BotFactory extends BaseFactory<BotModel, Bot, IBot, BotOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    uploadService: UploadService,
    botRepository: BotRepository,
    private readonly actorRepository: ActorRepository,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, uploadService, botRepository, BotModel, Bot);
  }
  async createBot(options: Omit<BotOptions, 'createdBy' | 'owner'>, images?: ActorImageUploadProps): Promise<BotModel> {
    const existingActor = await this.actorRepository.findOne({ slug: options.slug, tenant: options.tenant });
    if (existingActor) throw new ForbiddenException(`Bot with slug '${options.slug}'`);

    const owner = await this.actorRepository.findOneOrFail({ slug: options.slug, tenant: options.tenant });
    const createdBy = this.requester();

    return await this.create({ ...options, createdBy, owner }, async (bot) => {
      if (images) {
        const kind = ActorKind.Individual;
        bot.actor = await addImagesToActor(bot.actor, kind, images, createdBy, options.tenant, this.uploadService);
      }
      return bot;
    });
  }

  async updateBot(
    updateBot: UpdateBotDto,
    tenant: TenantCore,
    populate: Populate<Bot>,
    actorImages?: ActorImageUploadProps
  ) {
    const { id, ...data } = updateBot;

    const transform = async (bot: Bot) => {
      if (actorImages) {
        const actorKind = bot.actor.actorKind();
        await addImagesToActor(bot.actor, actorKind, actorImages, this.requester(), tenant, this.uploadService);
      }

      return bot;
    };

    const transformModel = async (model: BotModel) => {
      if (actorImages && model.actor && model.actor.actorImages)
        model.actor.actorImages = model.actor.actorImages.filter((image: IActorImage) => !image.lastActiveDate);
      return model;
    };

    return await this.update({ id, tenant }, populate, separateActorProps(data), false, transform, transformModel);
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
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
