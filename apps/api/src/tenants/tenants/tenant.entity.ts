import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
// eslint-disable-next-line import/no-cycle
import { ValidationStep } from '../validation-steps/validation-step.entity';

@ObjectType()
@Entity()
export class Tenant extends BaseEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field(() => [ValidationStep])
  @OneToMany(() => ValidationStep, 'tenant', { orderBy: { step: QueryOrder.ASC } })
  @TransformCollection()
  validationSteps = new Collection<ValidationStep>(this);

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  logo?: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  logoDark?: string | null = null;

  constructor(options: {
    id: string;
    logo?: string | null;
    logoDark?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
