import { Interaction } from '../interaction.entity';
import { WithActive } from '../../../shards/filters/with-active';
import { Entity, Property } from '@mikro-orm/core';
import { InteractionKind } from '@okampus/shared/enums';
import type { ValidationType } from '@okampus/shared/enums';
import type { ValidationOptions } from './validation.options';

@Entity()
@WithActive()
export class Validation extends Interaction {
  @Property({ type: 'datetime', nullable: true })
  lastActiveDate: Date | null = null;

  @Property()
  type!: ValidationType;

  constructor(options: ValidationOptions) {
    super({ ...options, interactionKind: InteractionKind.Validation });
    this.assign({ ...options, interactionKind: InteractionKind.Validation });
  }
}
