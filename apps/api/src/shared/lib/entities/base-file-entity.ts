import { OneToOne, Property } from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { FileUpload } from '../../../files/file-uploads/file-upload.entity';
import { BaseEntity } from './base.entity';

@ObjectType()
export abstract class BaseFileEntity extends BaseEntity {
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
