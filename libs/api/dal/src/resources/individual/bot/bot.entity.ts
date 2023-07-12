import { BotRepository } from './bot.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, OneToOne } from '@mikro-orm/core';

import type { Actor } from '../../actor/actor.entity';
import type { Individual } from '../individual.entity';
import type { BotOptions } from './bot.options';

@Entity({ customRepository: () => BotRepository })
export class Bot extends TenantScopedEntity {
  [EntityRepositoryType]!: BotRepository;

  @ManyToOne({ type: 'Actor' })
  owner!: Actor;

  @OneToOne({ type: 'Individual', inversedBy: 'bot' })
  individual!: Individual;

  constructor(options: BotOptions) {
    super(options);
    this.assign(options);
  }
}
