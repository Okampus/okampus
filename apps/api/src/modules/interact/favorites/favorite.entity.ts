/* eslint-disable import/no-cycle */
import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { ContentMaster } from '@common/lib/entities/content-master.entity';
import { Paginated } from '@common/modules/pagination';
import { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uaa/users/user.entity';

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
