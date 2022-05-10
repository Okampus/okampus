import { EntityManager } from '@mikro-orm/core';
import type { EntityName, EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InfoDoc } from '../../files/info-docs/info-doc.entity';
import { StudyDoc } from '../../files/study-docs/study-doc.entity';

@Injectable()
export class DocumentSubscriber implements EventSubscriber<InfoDoc | StudyDoc> {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    em: EntityManager,
  ) {
    em.getEventManager().registerSubscriber(this);
  }

  public getSubscribedEntities(): Array<EntityName<InfoDoc | StudyDoc>> {
    return [InfoDoc, StudyDoc];
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async afterCreate(args: EventArgs<InfoDoc | StudyDoc>): Promise<void> {
    this.eventEmitter.emit('document.created', args.entity);
  }
}
