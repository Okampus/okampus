import { ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Tenant } from '../../../tenants/tenants/tenant.entity';
import { BaseEntity } from './base.entity';


@ObjectType()
export abstract class BaseTenantEntity extends BaseEntity {
  @Field(() => String)
  @ManyToOne()
  tenant!: Tenant;
}
