import { Entity, EntityRepositoryType, Enum, ManyToOne, Property } from '@mikro-orm/core';
import type { Actor } from '../actor.entity';
import { BotRole } from '@okampus/shared/enums';
import type { BotOptions } from './bot.options';
import { Individual } from '../individual/individual.entity';
import { IndividualKind } from '@okampus/shared/enums';

import { BotRepository } from './bot.repository';

@Entity({ customRepository: () => BotRepository })
export class Bot extends Individual {
  [EntityRepositoryType]!: BotRepository;

  @Property({ type: 'text', hidden: true, nullable: true })
  tokenHash: string | null = null;

  @ManyToOne({ type: 'Actor' })
  owner!: Actor;

  @Enum(() => BotRole)
  botRole!: BotRole;

  constructor(options: BotOptions) {
    super({ ...options, individualKind: IndividualKind.Bot });
    this.assign({ ...options, individualKind: IndividualKind.Bot });
  }

  // public async resetToken(token: string): Promise<string> {
  //   this.token = await hash(token, 10);
  //   return token;
  // }

  // public async validateToken(token: string): Promise<boolean> {
  //   if (!this.token) return false;
  //   return await compare(token, this.token);
  // }
}
