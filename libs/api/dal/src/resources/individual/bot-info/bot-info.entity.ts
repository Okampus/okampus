import { BotInfoRepository } from './bot-info.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, OneToOne } from '@mikro-orm/core';

import type { Actor } from '../../actor/actor.entity';
import type { Individual } from '../individual.entity';
import type { BotInfoOptions } from './bot-info.options';

@Entity({ customRepository: () => BotInfoRepository })
export class BotInfo extends TenantScopedEntity {
  [EntityRepositoryType]!: BotInfoRepository;

  @ManyToOne({ type: 'Actor' })
  owner!: Actor;

  @OneToOne({ type: 'Individual', mappedBy: 'bot' })
  individual!: Individual;

  constructor(options: BotInfoOptions) {
    super(options);
    this.assign(options);
  }
}
