import { Index, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uua/users/user.entity';
import { BaseEntity } from './base.entity';
import { ContentMaster } from './content-master.entity';

@ObjectType()
export abstract class BaseContentInteraction extends BaseEntity {
  @Field(() => ContentMaster, { nullable: true })
  @ManyToOne({ onDelete: 'CASCADE' })
  contentMaster: ContentMaster | null = null;

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
