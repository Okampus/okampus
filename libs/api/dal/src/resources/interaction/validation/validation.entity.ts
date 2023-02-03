import { Entity, Property } from '@mikro-orm/core';
import { InteractionKind, ValidationType } from '@okampus/shared/enums';
import { Interaction } from '../interaction.entity';
import { ValidationOptions } from './validation.options';

@Entity()
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
