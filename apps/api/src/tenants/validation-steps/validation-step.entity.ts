import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { ValidationStepType } from '../../shared/lib/types/enums/validation-step-type.enum';
import { User } from '../../users/user.entity';
import { Tenant } from '../tenants/tenant.entity';

@Entity()
export class ValidationStep extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne('Tenant')
  tenant!: Tenant;

  @Property()
  step!: number;

  @Property()
  name!: string;

  @Enum(() => ValidationStepType)
  type!: ValidationStepType;

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
