/* eslint-disable import/no-cycle */
import {
  Cascade,
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { Paginated } from '@common/modules/pagination';
import { TransformCollection } from '@lib/decorators/transform-collection.decorator';
import { BaseEntity } from '@lib/entities/base.entity';
import { _slugify } from '@lib/utils/slugify';
import { ApprovalStep } from '@tenants/approval-steps/approval-step.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantImage } from './tenant-images/tenant-image.entity';

@ObjectType()
@Entity()
export class Tenant extends BaseEntity {
  @Field()
  @PrimaryKey()
  slug!: string;

  @Field()
  @Index()
  @Property({ type: 'text' })
  name!: string;

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

  constructor(options: CreateTenantDto) {
    options.slug = _slugify(options.slug ?? options.name);

    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedTenant extends Paginated(Tenant) {}
