import { Embeddable, Property } from '@mikro-orm/core';
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Embeddable()
export class UserStats {
  @Field(() => Int)
  @Property({ type: 'int' })
  points = 0;

  @Field(() => Int)
  @Property({ type: 'smallint' })
  postCount = 0;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Property({ type: 'datetime', nullable: true, default: null })
  lastPostAt: Date | null = null;

  @Field(() => Int)
  @Property({ type: 'smallint' })
  postStreak = 0;

  @Field(() => Int)
  @Property({ type: 'smallint' })
  replyCount = 0;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Property({ type: 'datetime', nullable: true, default: null })
  lastReplyAt: Date | null = null;

  @Field(() => Int)
  @Property({ type: 'smallint' })
  replyStreak = 0;

  @Field(() => Int)
  @Property({ type: 'smallint' })
  commentCount = 0;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Property({ type: 'datetime', nullable: true, default: null })
  lastComment: Date | null = null;

  @Field(() => Int)
  @Property({ type: 'smallint' })
  uploadCount = 0;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Property({ type: 'datetime', nullable: true, default: null })
  lastActionAt: Date | null = null;

  @Field(() => Int)
  @Property({ type: 'smallint' })
  actionStreak = 0;

  constructor(partial: Partial<UserStats>) {
    Object.assign(this, partial);
  }
}
