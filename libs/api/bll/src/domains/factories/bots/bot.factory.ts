import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Tag, TenantCore, Bot, BotRepository, Actor, BotOptions } from '@okampus/api/dal';
import { IBot } from '@okampus/shared/dtos';
import { loadBot } from '../loader.utils';
// eslint-disable-next-line import/no-cycle
import { BaseFactory } from '../base.factory';
import { BotModel } from './bot.model';

@Injectable()
export class BotFactory extends BaseFactory<BotModel, Bot, IBot, BotOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, botRepository: BotRepository) {
    super(ep, botRepository, BotModel, Bot);
  }

  entityToModel(entity: Bot): BotModel | undefined {
    const bot = loadBot(entity);
    if (!bot) return undefined;
    return this.createModel(bot);
  }

  modelToEntity(model: Required<BotModel>): Bot {
    return new Bot({
      botRole: model.botRole,
      name: model.actor.name,
      bio: model.actor.bio,
      primaryEmail: model.actor.primaryEmail,
      slug: model.actor.slug,
      tenant: { id: model.tenant.id } as TenantCore,
      tags: model.actor.tags.map((tag) => ({ id: tag.id } as Tag)),
      owner: { id: model.owner.id } as Actor,
    });
  }
}
