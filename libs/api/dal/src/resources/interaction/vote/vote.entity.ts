import { Interaction } from '../interaction.entity';
import { Entity, Property } from '@mikro-orm/core';
import { InteractionKind } from '@okampus/shared/enums';
import type { VoteOptions } from './vote.options';

@Entity()
export class Vote extends Interaction {
  @Property({ type: 'smallint' })
  value!: -1 | 0 | 1;

  constructor(options: VoteOptions) {
    super({ ...options, interactionKind: InteractionKind.Vote });
    this.assign({ ...options, interactionKind: InteractionKind.Vote });
  }
}
