import { Interaction } from '../interaction.entity';
import { WithActive } from '../../../shards/filters/with-active';
import { Entity, Enum, Index } from '@mikro-orm/core';
import { ReactionType, InteractionKind } from '@okampus/shared/enums';
import type { ReportOptions } from '../report/report.options';

@Entity()
@WithActive()
export class Reaction extends Interaction {
  @Index()
  @Enum({ items: () => ReactionType, type: 'string' })
  reactionType!: ReactionType;

  constructor(options: ReportOptions) {
    super({ ...options, interactionKind: InteractionKind.Reaction });
    this.assign({ ...options, interactionKind: InteractionKind.Reaction });
  }
}
