import { BotRepository } from './bot.repository';
import { Individual } from '../individual/individual.entity';
import { Entity, EntityRepositoryType, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BotRole } from '@okampus/shared/enums';
import { IndividualKind } from '@okampus/shared/enums';
import type { Actor } from '../actor.entity';
import type { BotOptions } from './bot.options';

@Entity({ customRepository: () => BotRepository })
export class Bot extends Individual {
  [EntityRepositoryType]!: BotRepository;

  @Property({ type: 'text', hidden: true, nullable: true })
  tokenHash: string | null = null;

  @ManyToOne({ type: 'Actor' })
  owner!: Actor;

  @Enum({ items: () => BotRole, type: 'string' })
  botRole!: BotRole;

  constructor(options: BotOptions) {
    super({ ...options, individualKind: IndividualKind.Bot });
    this.assign({ ...options, individualKind: IndividualKind.Bot });
  }
}
