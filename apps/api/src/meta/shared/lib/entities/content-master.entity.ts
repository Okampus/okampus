/* eslint-disable import/no-cycle */
import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tag } from '@modules/assort/tags/tag.entity';
import { Content } from '@modules/create/contents/entities/content.entity';
import type { Favorite } from '@modules/interact/favorites/favorite.entity';
import type { Reaction } from '@modules/interact/reactions/reaction.entity';
import type { Report } from '@modules/interact/reports/report.entity';
import type { Validation } from '@modules/interact/validations/validation.entity';
import type { Vote } from '@modules/interact/votes/vote.entity';
import { User } from '@modules/uua/users/user.entity';

import { TransformCollection } from '../decorators/transform-collection.decorator';
import { ContentMasterType } from '../types/enums/content-master-type.enum';
import { BaseEntity } from './base.entity';

@ObjectType()
@Entity({
  discriminatorColumn: 'kind',
  abstract: true,
})
export abstract class ContentMaster extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'text' })
  title!: string;

  @Field(() => [Tag])
  @ManyToMany()
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Field(() => Content)
  @OneToOne()
  post!: Content;

  @Field(() => [User])
  @ManyToMany()
  @TransformCollection()
  participants = new Collection<User>(this);

  @Field(() => ContentMasterType)
  @Enum(() => ContentMasterType)
  kind!: ContentMasterType;

  @OneToMany('Validation', 'contentMaster', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  validations = new Collection<Validation>(this);

  @OneToMany('Reaction', 'contentMaster', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  reactions = new Collection<Reaction>(this);

  @OneToMany('Report', 'contentMaster', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany('Vote', 'contentMaster', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  votes = new Collection<Vote>(this);

  @OneToMany('Favorite', 'contentMaster', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  constructor(options: {
    title: string;
    post: Content;
  }) {
    super();
    this.assign(options);
  }
}
