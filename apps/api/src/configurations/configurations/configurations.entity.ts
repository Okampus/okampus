import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
} from '@mikro-orm/core';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import type { ValidationStep } from '../validation-steps/validation-step.entity';

@Entity()
export class Configuration extends BaseEntity {
  @PrimaryKey()
  id!: string;

  @OneToMany('ValidationStep', (step: ValidationStep) => step.configuration)
  @TransformCollection()
  validationSteps = new Collection<ValidationStep>(this);

  constructor(options: {
    id: string;
  }) {
    super();
    this.assign(options);
  }
}
