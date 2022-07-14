import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
// eslint-disable-next-line import/no-cycle
import { Content } from '../../../contents/entities/content.entity';
import { Tag } from '../../../tags/tag.entity';
import type { User } from '../../../users/user.entity';
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
  contentMasterId!: number;

  @Field()
  @Property({ type: 'text' })
  title!: string;

  @Field(() => [Tag])
  @ManyToMany()
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @Field(() => Content)
  @OneToOne()
  post?: Content;

  @ManyToMany()
  @TransformCollection()
  participants = new Collection<User>(this);

  @Enum(() => ContentMasterType)
  kind: ContentMasterType;

  constructor(options: {
    title: string;
    post?: Content;
  }) {
    super();
    this.title = options.title;
    if (options.post)
      this.post = options.post;
  }
}
