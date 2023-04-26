import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne, OneToOne } from '@mikro-orm/core';
import type { Actor } from '../../actor/actor.entity';

import type { Individual } from '../individual.entity';
import type { BotInfoOptions } from './bot-info.options';

@Entity()
export class BotInfo extends TenantScopedEntity {
  @ManyToOne({ type: 'Actor' })
  owner!: Actor;

  @OneToOne({ type: 'Individual', mappedBy: 'bot' })
  individual!: Individual;

  constructor(options: BotInfoOptions) {
    super(options);
    this.assign(options);
  }
}
