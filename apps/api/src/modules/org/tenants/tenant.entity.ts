
import {
  // Collection,
  Entity,
  // OneToMany,
  PrimaryKey,
  Property,
  // QueryOrder,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
// Import { TransformCollection } from '@common/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '@common/lib/entities/base.entity';
// Import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';

@ObjectType()
@Entity()
export class Tenant extends BaseEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  // @Field(() => [ApprovalStep])
  // @OneToMany(() => ApprovalStep, 'tenant', { orderBy: { step: QueryOrder.ASC } })
  // @TransformCollection()
  // approvalSteps = new Collection<ApprovalStep>(this);

  @Field(() => GraphQLJSON, { nullable: true })
  @Property({ type: 'json' })
  eventApprovalForm: object[] | object | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  logo: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  logoDark: string | null = null;

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
    eventValidationForm?: object[] | object | null;
    logo?: string | null;
    logoDark?: string | null;
    tenantOidcName?: string | null;
    oidcEnabled?: boolean;
    oidcClientId?: string | null;
    oidcClientSecret?: string | null;
    oidcDiscoveryUrl?: string | null;
    oidcScopes?: string | null;
    oidcCallbackUri?: string | null;
  }) {
    super();
    this.assign(options);
  }
}