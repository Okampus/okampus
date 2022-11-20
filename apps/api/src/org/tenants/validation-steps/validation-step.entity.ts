/* eslint-disable import/no-cycle */
import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransformCollection } from '../../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../../shared/lib/entities/base.entity';
import { ValidationStepType } from '../../../shared/lib/types/enums/validation-step-type.enum';
import { User } from '../../../uua/users/user.entity';
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
  // eslint-disable-next-line no-undefined
  @ManyToMany(() => User, undefined, { orderBy: { id: QueryOrder.ASC } })
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
