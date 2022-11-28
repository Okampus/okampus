import { OneToOne, Property } from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
// eslint-disable-next-line import/no-cycle
import { FileUpload } from '@modules/upload/file-uploads/file-upload.entity';
// eslint-disable-next-line import/no-cycle
import { BaseTenantEntity } from './base-tenant.entity';

@ObjectType()
export abstract class BaseFileEntity extends BaseTenantEntity {
  @Field(() => FileUpload)
  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @Field(() => GraphQLISODateTime)
  @Property({ type: 'date' })
  lastActiveDate: Date | null = null;

  @Field(() => Boolean)
  @Property()
  active = false;
}
