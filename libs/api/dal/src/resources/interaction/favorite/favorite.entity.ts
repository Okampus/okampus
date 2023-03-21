import { Interaction } from '../interaction.entity';
import { WithActive } from '../../../shards/filters/with-active';
import { Entity } from '@mikro-orm/core';
import { InteractionKind } from '@okampus/shared/enums';
import type { FavoriteOptions } from './favorite.options';

@Entity()
@WithActive()
export class Favorite extends Interaction {
  constructor(options: FavoriteOptions) {
    super({ ...options, interactionKind: InteractionKind.Favorite });
    this.assign({ ...options, interactionKind: InteractionKind.Favorite });
  }
}
