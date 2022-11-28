
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
import { TransformCollection } from '@common/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { ApprovalStepType } from '@common/lib/types/enums/approval-step-type.enum';
import { User } from '@modules/uaa/users/user.entity';
import { Tenant } from '../tenant.entity';

@ObjectType()
@Entity()
export class ApprovalStep extends BaseEntity {
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

  @Field(() => ApprovalStepType)
  @Enum(() => ApprovalStepType)
  type!: ApprovalStepType;

  @Field(() => [User])
  // eslint-disable-next-line no-undefined
  @ManyToMany(() => User, undefined, { orderBy: { id: QueryOrder.ASC } })
  @TransformCollection()
  users = new Collection<User>(this);

  constructor(options: {
    tenant: Tenant;
    type: ApprovalStepType;
    step: number;
    name: string;
  }) {
    super();
    this.assign(options);
  }
}
