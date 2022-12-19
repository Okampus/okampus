/* eslint-disable import/no-cycle */
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
import { Paginated } from '@common/modules/pagination';
import { Favorite } from '@interact/favorites/favorite.entity';
import { Reaction } from '@interact/reactions/reaction.entity';
import { Report } from '@interact/reports/report.entity';
import { Vote } from '@interact/votes/vote.entity';
import { TransformCollection } from '@lib/decorators/transform-collection.decorator';
import { BaseEntity } from '@lib/entities/base.entity';
import { ContentMaster } from '@lib/entities/content-master.entity';
import { ContentKind } from '@lib/types/enums/content-kind.enum';
import { User } from '@uaa/users/user.entity';
import { Edit } from './edit.entity';

@ObjectType()
@Entity()
export class Content extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'text' })
  body!: string;

  @Field(() => Boolean)
  @Property()
  isAnonymous!: boolean;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  author!: User;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE', hidden: true })
  realAuthor!: User;

  @Field(() => Int)
  @Property()
  upvoteCount = 0;

  @Field(() => Int)
  @Property()
  @Transform(({ obj }: { obj: Content }) => (obj.kind === ContentKind.Comment ? null : obj.downvoteCount))
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

  @OneToMany(() => Reaction, 'content', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  reactions = new Collection<Reaction>(this);

  @OneToMany(() => Report, 'content', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany(() => Vote, 'content', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  votes = new Collection<Vote>(this);

  @OneToMany(() => Favorite, 'content', { cascade: [Cascade.REMOVE] })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  @Field(() => ContentKind)
  @Enum(() => ContentKind)
  @Index()
  kind!: ContentKind;

  @Field(() => Content, { nullable: true })
  @ManyToOne({ onDelete: 'CASCADE' })
  @Transform(({ obj }: { obj: Content }) => ({ id: obj.parent?.id, kind: obj.parent?.kind }))
  parent: Content | null = null;

  @Field(() => [Edit], { nullable: true })
  @OneToMany(() => Edit, 'parent')
  @TransformCollection()
  edits = new Collection<Edit>(this);

  @Field(() => ContentMaster, { nullable: true })
  @ManyToOne(() => ContentMaster, { nullable: true, onDelete: 'CASCADE' })
  contentMaster: ContentMaster | null = null;

  @Field(() => Boolean)
  @Property()
  hidden = false;

  @Field(() => Boolean)
  @Property()
  isVisible = true;

  @Field(() => Edit, { nullable: true })
  @OneToOne('Edit', { nullable: true })
  lastEdit: Edit | null = null;

  constructor(options: {
    body: string;
    author: User;
    realAuthor: User;
    kind: ContentKind;
    isAnonymous?: boolean;
    contentMaster?: ContentMaster | null;
    parent?: Content | null;
  }) {
    super();
    this.assign(options);
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

@ObjectType()
export class PaginatedContent extends Paginated(Content) {}
