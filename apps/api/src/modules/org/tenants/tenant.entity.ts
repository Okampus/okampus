/* eslint-disable import/no-cycle */
import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { TransformCollection } from '@common/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '@common/lib/entities/base.entity';

import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { TenantImage } from './tenant-images/tenant-image.entity';

@ObjectType()
@Entity()
export class Tenant extends BaseEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field(() => [ApprovalStep])
  @OneToMany(() => ApprovalStep, 'tenant', { orderBy: { step: QueryOrder.ASC } })
  @TransformCollection()
  approvalSteps = new Collection<ApprovalStep>(this);

  @Field(() => GraphQLJSON, { nullable: true })
  @Property({ type: 'json' })
  eventApprovalForm: object[] | object | null = null;


  @Field(() => TenantImage, { nullable: true })
  @ManyToOne({ type: TenantImage, cascade: [Cascade.ALL], nullable: true })
  logo: TenantImage | null = null;

  @Field(() => TenantImage, { nullable: true })
  @ManyToOne({ type: TenantImage, cascade: [Cascade.ALL], nullable: true })
  logoDark: TenantImage | null = null;


  @Field(() => String)
  @Property()
  tenantOidcName: string | null = null;

  @Field(() => Boolean)
  @Property()
  oidcEnabled = false;

  @Field(() => String)
  @Property()
  oidcClientId: string | null = null;

  @Field(() => String)
  @Property({ type: 'text', hidden: true })
  oidcClientSecret: string | null = null;

  @Field(() => String)
  @Property({ type: 'text' })
  oidcDiscoveryUrl: string | null = null;

  @Field(() => String)
  @Property()
  oidcScopes: string | null = null;

  @Field(() => String)
  @Property({ type: 'text' })
  oidcCallbackUri: string | null = null;

  constructor(options: {
    id: string;
    eventValidationForm?: object[] | object;
    tenantOidcName?: string;
    oidcEnabled?: boolean;
    oidcClientId?: string;
    oidcClientSecret?: string;
    oidcDiscoveryUrl?: string;
    oidcScopes?: string;
    oidcCallbackUri?: string;
  }) {
    super();
    this.assign(options);
  }
}
