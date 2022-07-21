import {
  BeforeUpdate,
  Cascade,
  Collection,
  Entity,
  Enum,
  EventArgs,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import type { Favorite } from '../../favorites/favorite.entity';
import type { Reaction } from '../../reactions/reaction.entity';
import type { Report } from '../../reports/report.entity';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
// eslint-disable-next-line import/no-cycle
import { ContentMaster } from '../../shared/lib/entities/content-master.entity';
import { ContentKind } from '../../shared/lib/types/enums/content-kind.enum';
import { User } from '../../users/user.entity';
import type { Vote } from '../../votes/vote.entity';
// eslint-disable-next-line import/no-cycle
import { ContentEdit } from './content-edit.entity';

@ObjectType()
@Entity()
export class Content extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'text' })
  body!: string;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Transform(({ obj }: { obj: Content }) => obj.author.id)
  author!: User;

  @Field(() => Int)
  @Property()
  upvoteCount = 0;

  @Field(() => Int)
  @Property()
  @Transform(({ obj }: { obj: Content }) => (obj.kind === ContentKind.Comment ? undefined : obj.downvoteCount))
  downvoteCount = 0;

  @Field(() => Int)
  @Property()
  totalVoteCount = 0;

  @Field(() => Int)
  @Property()
  reportCount = 0;

  @Field(() => Int)
  @Property()
  favoriteCount = 0;

  @Field(() => Int)
  @Property()
  replyCount = 0;

  @OneToMany('Reaction', 'content', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  reactions = new Collection<Reaction>(this);

  @OneToMany('Report', 'content', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany('Vote', 'content', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  votes = new Collection<Vote>(this);

  @OneToMany('Favorite', 'content', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  @Field(() => ContentKind)
  @Enum(() => ContentKind)
  @Index()
  kind!: ContentKind;

  @Field(() => Content)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Transform(({ obj }: { obj: Content }) => ({ id: obj.parent?.id, kind: obj.parent?.kind }))
  parent?: Content;

  @Field(() => [ContentEdit], { nullable: true })
  @OneToMany('ContentEdit', 'parent')
  @TransformCollection()
  edits = new Collection<ContentEdit>(this);

  @Field(() => ContentMaster)
  @ManyToOne({ onDelete: 'CASCADE' })
  contentMaster?: ContentMaster;

  @Field(() => Boolean)
  @Property()
  hidden = false;

  @Field(() => Boolean)
  @Property()
  isVisible = true;

  @Field(() => ContentEdit)
  @OneToOne()
  lastEdit?: ContentEdit;

  constructor(options: {
    body: string;
    author: User;
    kind: ContentKind;
    contentMaster?: ContentMaster;
    parent?: Content;
  }) {
    super();
    this.body = options.body;
    this.author = options.author;
    this.kind = options.kind;
    if (options.contentMaster)
      this.contentMaster = options.contentMaster;
    if (options.parent)
      this.parent = options.parent;
  }

  @BeforeUpdate()
  public beforeUpdate(event: EventArgs<this>): void {
    const payload = event.changeSet?.payload;
    if (payload && ('upvoteCount' in payload || 'downvoteCount' in payload))
      this.totalVoteCount = this.upvoteCount - this.downvoteCount;
  }
}

export const DEFAULT_INTERACTIONS = {
  reactions: [] as Reaction[],
  userFavorited: false,
  userVoted: 0,
  userReported: null,
};
