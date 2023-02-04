import { Entity, Enum, Index, Property } from '@mikro-orm/core';
import type { ValidationType } from '@okampus/shared/enums';
import { ReactionType, InteractionKind } from '@okampus/shared/enums';
import { Interaction } from '../interaction.entity';
import type { ReportOptions } from '../report/report.options';

@Entity()
export class Reaction extends Interaction {
  @Enum(() => ReactionType)
  @Index()
  reactionType!: ReactionType;

  @Property()
  type!: ValidationType;

  constructor(options: ReportOptions) {
    super({ ...options, interactionKind: InteractionKind.Reaction });
    this.assign({ ...options, interactionKind: InteractionKind.Reaction });
  }
}
