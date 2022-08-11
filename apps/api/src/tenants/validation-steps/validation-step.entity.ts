import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { ValidationStepType } from '../../shared/lib/types/enums/validation-step-type.enum';
// eslint-disable-next-line import/no-cycle
import { User } from '../../users/user.entity';
// eslint-disable-next-line import/no-cycle
import { Tenant } from '../tenants/tenant.entity';

@ObjectType()
@Entity()
export class ValidationStep extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Tenant)
  @ManyToOne('Tenant')
  tenant!: Tenant;

  @Field(() => Int)
  @Property()
  step!: number;

  @Field()
  @Property()
  name!: string;

  @Field(() => ValidationStepType)
  @Enum(() => ValidationStepType)
  type!: ValidationStepType;

  @Field(() => [User])
  @ManyToMany(() => User)
  @TransformCollection()
  users = new Collection<User>(this);

  constructor(options: {
    tenant: Tenant;
    type: ValidationStepType;
    step: number;
    name: string;
  }) {
    super();
    this.assign(options);
  }
}
