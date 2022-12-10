import { Index, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Content } from '@create/contents/entities/content.entity';
import { User } from '@uaa/users/user.entity';
import { BaseEntity } from './base.entity';
import { ContentMaster } from './content-master.entity';

@ObjectType()
export abstract class BaseContentInteraction extends BaseEntity {
  @Field(() => ContentMaster, { nullable: true })
  @ManyToOne({ type: 'ContentMaster', onDelete: 'CASCADE', nullable: true })
  contentMaster?: ContentMaster | null = null;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @Field(() => Content)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  content!: Content;

  constructor(options: {
    user: User;
    content: Content;
  }) {
    super();
    this.assign(options);
    if (options.content.contentMaster)
      this.contentMaster = options.content.contentMaster;
  }
}
