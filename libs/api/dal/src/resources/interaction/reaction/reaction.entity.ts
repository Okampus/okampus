import { Interaction } from '../interaction.entity';
import { Entity, Enum, Index } from '@mikro-orm/core';
import { ReactionType, InteractionKind } from '@okampus/shared/enums';
import type { ReportOptions } from '../report/report.options';

@Entity()
export class Reaction extends Interaction {
  @Enum({ items: () => ReactionType, type: 'string' })
  @Index()
  reactionType!: ReactionType;

  constructor(options: ReportOptions) {
    super({ ...options, interactionKind: InteractionKind.Reaction });
    this.assign({ ...options, interactionKind: InteractionKind.Reaction });
  }
}
