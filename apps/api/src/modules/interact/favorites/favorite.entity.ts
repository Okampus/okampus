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
export class Favorite extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => Boolean)
  @Property()
  active = true;

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
    active?: boolean | null;
  }) {
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedFavorite extends Paginated(Favorite) {}
