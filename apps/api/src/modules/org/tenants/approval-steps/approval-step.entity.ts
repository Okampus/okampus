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
import type { EntityManager } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TransformCollection } from '@lib/decorators/transform-collection.decorator';
import { BaseEntity } from '@lib/entities/base.entity';
import { ApprovalStepType } from '@lib/types/enums/approval-step-type.enum';
import { Tenant } from '@tenants/tenant.entity';
import { User } from '@uaa/users/user.entity';

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

export class ApprovalStepFactory extends Factory<ApprovalStep> {
  tenant: Tenant;
  step: number;
  model = ApprovalStep;

  constructor(em: EntityManager, tenant: Tenant, step: number) {
    super(em);
    this.tenant = tenant;
    this.step = step;
  }

  public definition(): Partial<ApprovalStep> {
    return {
      tenant: this.tenant,
      name: `Étape de validation #${this.step}`,
      step: this.step,
      type: ApprovalStepType.Event,
    };
  }
}
