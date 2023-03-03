import { Interaction } from '../interaction.entity';
import { WithActive } from '../../../shards/filters/with-active';
import { Entity, Property } from '@mikro-orm/core';
import { InteractionKind } from '@okampus/shared/enums';
import type { FavoriteOptions } from './favorite.options';

@Entity()
@WithActive()
export class Favorite extends Interaction {
  @Property({ type: 'datetime', nullable: true })
  lastActiveDate: Date | null = null;

  constructor(options: FavoriteOptions) {
    super({ ...options, interactionKind: InteractionKind.Favorite });
    this.assign({ ...options, interactionKind: InteractionKind.Favorite });
  }
}
