import { ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
// eslint-disable-next-line import/no-cycle
import { Tenant } from '@tenants/tenant.entity';
import { BaseEntity } from './base.entity';

@ObjectType()
export abstract class BaseTenantEntity extends BaseEntity {
  @Field(() => Tenant)
  @ManyToOne({ type: Tenant })
  tenant: Tenant;
}
