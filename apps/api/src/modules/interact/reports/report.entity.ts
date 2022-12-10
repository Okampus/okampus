/* eslint-disable import/no-cycle */
import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Paginated } from '@common/modules/pagination';
import { Content } from '@create/contents/entities/content.entity';
import { BaseEntity } from '@lib/entities/base.entity';
import { ContentMaster } from '@lib/entities/content-master.entity';
import { User } from '@uaa/users/user.entity';

@ObjectType()
@Entity()
export class Report extends BaseEntity {
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
    target: User;
    content: Content;
    reason?: string | null;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedReport extends Paginated(Report) {}
