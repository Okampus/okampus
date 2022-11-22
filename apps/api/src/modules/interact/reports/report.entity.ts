import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseContentInteraction } from '@meta/shared/lib/entities/base-content-interaction.entity';
import type { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uua/users/user.entity';

@ObjectType()
@Entity()
export class Report extends BaseContentInteraction {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  target!: User;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  reason: string | null = null;

  constructor(options: {
    user: User;
    target: User;
    content: Content;
    reason?: string | null;
  }) {
    super(options);
    this.assign(options);
  }
}
