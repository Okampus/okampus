import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { TenantImageType } from '@common/lib/types/enums/tenant-image-type.enum';
// eslint-disable-next-line import/no-cycle
import { FileUpload } from '@modules/upload/file-uploads/file-upload.entity';
// eslint-disable-next-line import/no-cycle
import { Tenant } from '../tenant.entity';

@ObjectType()
@Entity()
export class TenantImage extends BaseEntity {
  @Field()
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => Tenant)
  @ManyToOne({ type: Tenant, onDelete: 'CASCADE' })
  tenant: Tenant;

  @Field(() => TenantImageType)
  @Enum(() => TenantImageType)
  type!: TenantImageType;

  @Field(() => String, { nullable: true })
  @Property()
  descriptor: string | null = null;

  @Field(() => FileUpload)
  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @Field(() => GraphQLISODateTime)
  @Property({ type: 'date' })
  lastActiveDate: Date | null = null;

  @Field(() => Boolean)
  @Property()
  active = false;

  constructor(options: {
    file: FileUpload;
    tenant: Tenant;
    type: TenantImageType;
    descriptor?: string | null;
  }) {
    super();
    this.assign(options);
  }
}