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
import { Content } from '../../../create/contents/entities/content.entity';
import type { Favorite } from '../../../create/interact/favorites/favorite.entity';
import type { Reaction } from '../../../create/interact/reactions/reaction.entity';
import type { Report } from '../../../create/interact/reports/report.entity';
import type { Vote } from '../../../create/interact/votes/vote.entity';
import { Tag } from '../../../org/data/tags/tag.entity';
import { User } from '../../../uua/users/user.entity';
import type { Validation } from '../../../validations/validation.entity';

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
