import { BotModel } from './bot.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BotRepository } from '@okampus/api/dal';
import { Bot, TenantCore, Tag, Actor } from '@okampus/api/dal';

import type { BotOptions } from '@okampus/api/dal';
import type { IBot } from '@okampus/shared/dtos';

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
