import { Embeddable, Property } from '@mikro-orm/core';
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Embeddable()
export class UserStats {
  @Field(() => Int)
  @Property({ type: 'int', default: 0 })
  points = 0;

  @Field(() => Int)
  @Property({ type: 'smallint', default: 0 })
  postCount = 0;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Property({ type: 'datetime', nullable: true, default: null })
  lastPostAt: Date | null = null;

  @Field(() => Int)
  @Property({ type: 'smallint', default: 0 })
  postStreak = 0;

  @Field(() => Int)
  @Property({ type: 'smallint', default: 0 })
  replyCount = 0;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Property({ type: 'datetime', nullable: true, default: null })
  lastReplyAt: Date | null = null;

  @Field(() => Int)
  @Property({ type: 'smallint', default: 0 })
  replyStreak = 0;

  @Field(() => Int)
  @Property({ type: 'smallint', default: 0 })
  commentCount = 0;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Property({ type: 'datetime', nullable: true, default: null })
  lastCommentAt: Date | null = null;

  @Field(() => Int)
  @Property({ type: 'smallint', default: 0 })
  uploadCount = 0;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Property({ type: 'datetime', nullable: true, default: null })
  lastActionAt: Date | null = null;

  @Field(() => Int)
  @Property({ type: 'smallint', default: 0 })
  actionStreak = 0;

  constructor(partial: Partial<UserStats>) {
    Object.assign(this, partial);
  }
}
