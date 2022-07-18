import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { Content } from '../contents/entities/content.entity';
import { BaseContentInteraction } from '../shared/lib/entities/base-content-interaction.entity';
import { User } from '../users/user.entity';

@ObjectType()
@Entity()
export class Report extends BaseContentInteraction {
  @Field(() => Int)
  @PrimaryKey()
  reportId!: number;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  target!: User;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  reason?: string;

  constructor(options: {
    user: User;
    target: User;
    content: Content;
    reason?: string | null;
  }) {
    super();
    this.content = options.content;
    this.contentMaster = options.content.contentMaster;
    this.user = options.user;
    this.target = options.target;
    if (options.reason)
      this.reason = options.reason;
  }
}
