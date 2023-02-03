import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { InteractionKind, ReportReason } from '@okampus/shared/enums';
import { Interaction } from '../interaction.entity';
import { Individual } from '../../actor/individual/individual.entity';
import { ReportOptions } from './report.options';

@Entity()
export class Report extends Interaction {
  @ManyToOne(() => Individual)
  target!: Individual;

  @Enum(() => ReportReason)
  type!: ReportReason;

  @Property({ type: 'text', nullable: true })
  reason: string | null = null;

  constructor(options: ReportOptions) {
    super({ ...options, interactionKind: InteractionKind.Report });
    this.assign({ ...options, interactionKind: InteractionKind.Report });
  }
}
