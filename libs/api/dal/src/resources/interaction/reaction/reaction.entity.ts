import { Interaction } from '../interaction.entity';
import { WithActive } from '../../../shards/filters/with-active';
import { Entity, Enum, Index, Property } from '@mikro-orm/core';
import { ReactionType, InteractionKind } from '@okampus/shared/enums';
import type { ReportOptions } from '../report/report.options';

@Entity()
@WithActive()
export class Reaction extends Interaction {
  @Enum({ items: () => ReactionType, type: 'string' })
  @Index()
  reactionType!: ReactionType;

  @Property({ type: 'datetime', nullable: true })
  lastActiveDate: Date | null = null;

  constructor(options: ReportOptions) {
    super({ ...options, interactionKind: InteractionKind.Reaction });
    this.assign({ ...options, interactionKind: InteractionKind.Reaction });
  }
}
