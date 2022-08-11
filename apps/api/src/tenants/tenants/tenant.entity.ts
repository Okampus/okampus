import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
// eslint-disable-next-line import/no-cycle
import { FileUpload } from '../../files/file-uploads/file-upload.entity';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
// eslint-disable-next-line import/no-cycle
import { ValidationStep } from '../validation-steps/validation-step.entity';

@ObjectType()
@Entity()
export class Tenant extends BaseEntity {
  @Field()
  @PrimaryKey()
  id!: string;

  @Field(() => [ValidationStep])
  @OneToMany('ValidationStep', 'tenant')
  @TransformCollection()
  validationSteps = new Collection<ValidationStep>(this);

  @Field(() => FileUpload, { nullable: true })
  @OneToOne({ onDelete: 'CASCADE' })
  logo?: FileUpload | null = null;

  constructor(options: {
    id: string;
    logo?: FileUpload | null;
  }) {
    super();
    this.assign(options);
  }
}
