import { Index, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Content } from '../../../contents/entities/content.entity';
import { User } from '../../../users/user.entity';
import { BaseEntity } from './base.entity';
import { ContentMaster } from './content-master.entity';

@ObjectType()
export abstract class BaseContentInteraction extends BaseEntity {
  @Field(() => ContentMaster)
  @ManyToOne({ onDelete: 'CASCADE' })
  contentMaster?: ContentMaster;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @Field(() => Content)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  content!: Content;
}
