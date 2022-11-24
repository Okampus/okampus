/* eslint-disable import/no-cycle */
import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { ContentMaster } from '@common/lib/entities/content-master.entity';
import { AllReaction } from '@common/lib/types/enums/reaction.enum';
import { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uua/users/user.entity';

@ObjectType()
@Entity()
export class Reaction extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => AllReaction)
  @Enum(() => AllReaction)
  @Index()
  value!: AllReaction;

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
    value: AllReaction;
  }) {
    super();
    this.assign(options);
  }
}
