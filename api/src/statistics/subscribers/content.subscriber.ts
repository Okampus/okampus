import { EntityManager } from '@mikro-orm/core';
import type { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Content } from '../../contents/content.entity';

@Injectable()
export class ContentSubscriber implements EventSubscriber<Content> {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    em: EntityManager,
  ) {
    em.getEventManager().registerSubscriber(this);
  }

  public getSubscribedEntities(): Array<EntityName<Content>> {
    return [Content];
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async afterCreate(args: EventArgs<Content>): Promise<void> {
    this.eventEmitter.emit('content.created', args.entity);
  }
}
