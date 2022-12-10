/* eslint-disable import/no-cycle */
import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/modules/pagination';
import { Content } from '@create/contents/entities/content.entity';
import { BaseEntity } from '@lib/entities/base.entity';
import { ContentMaster } from '@lib/entities/content-master.entity';
import { User } from '@uaa/users/user.entity';

@ObjectType()
@Entity()
export class Vote extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Int)
  @Enum()
  value!: -1 | 0 | 1;

  @Field(() => Content)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  content!: Content;

  @Field(() => ContentMaster, { nullable: true })
  @ManyToOne({ type: 'ContentMaster', onDelete: 'CASCADE', nullable: true })
  contentMaster?: ContentMaster | null = null;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  constructor(options: {
    user: User;
    content: Content;
    value: -1 | 0 | 1;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedVote extends Paginated(Vote) {}
