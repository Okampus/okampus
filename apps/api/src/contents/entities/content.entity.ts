import {
  BeforeUpdate,
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
import { CONTENT_AUTHOR_EXCLUDED } from '../../shared/lib/constants';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
// eslint-disable-next-line import/no-cycle
import { ContentMaster } from '../../shared/lib/entities/content-master.entity';
import { ContentKind } from '../../shared/lib/types/enums/content-kind.enum';
import { ContentMasterType } from '../../shared/lib/types/enums/content-master-type.enum';
import { User } from '../../users/user.entity';
// eslint-disable-next-line import/no-cycle
import { ContentEdit } from './content-edit.entity';

@ObjectType()
@Entity()
export class Content extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  contentId!: number;

  @Field()
  @Property({ type: 'text' })
  body!: string;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Transform(({ obj }: { obj: Content }) => obj.author.userId, { groups: [CONTENT_AUTHOR_EXCLUDED] })
  author!: User;

  @Field(() => Int)
  @Property()
  upvotes = 0;

  @Field(() => Int)
  @Property()
  @Transform(({ obj }: { obj: Content }) => (obj.kind === ContentKind.Comment ? undefined : obj.downvotes))
  downvotes = 0;

  @Field(() => Int)
  @Property()
  votes = 0;

  @Field(() => ContentKind)
  @Enum(() => ContentKind)
  @Index()
  kind!: ContentKind;

  @Field(() => Content)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Transform(({ obj }: { obj: Content }) => ({ contentId: obj.parent?.contentId, kind: obj.parent?.kind }))
  parent?: Content;

  @Field(() => [ContentEdit], { nullable: true })
  @OneToMany(() => ContentEdit, edit => edit.parent)
  @TransformCollection()
  // @Exclude()
  edits = new Collection<ContentEdit>(this);

  @Field(() => Int)
  @Enum(() => ContentMasterType)
  contentMasterType!: ContentMasterType;

  @Field(() => ContentMaster)
  @ManyToOne({ onDelete: 'CASCADE' })
  // @Exclude()
  contentMaster!: ContentMaster;

  @Field(() => Int)
  @Property({ persist: false })
  contentMasterId!: number;

  @Field(() => Boolean)
  @Property()
  hidden = false;

  @Field(() => Boolean)
  @Property()
  isVisible = true;

  @Field(() => Int)
  @Property()
  reportCount = 0;

  @Field(() => ContentEdit)
  @OneToOne()
  lastEdit?: ContentEdit;

  constructor(options: {
    body: string;
    author: User;
    kind: ContentKind;
    contentMaster: ContentMaster;
    contentMasterType: ContentMasterType;
    parent?: Content;
  }) {
    super();
    this.body = options.body;
    this.author = options.author;
    this.kind = options.kind;
    this.contentMaster = options.contentMaster;
    this.contentMasterType = options.contentMasterType;
    this.contentMasterId = this.contentMaster.contentMasterId;
    if (options.parent)
      this.parent = options.parent;
  }

  @BeforeUpdate()
  public beforeUpdate(event: EventArgs<this>): void {
    const payload = event.changeSet?.payload;
    if (payload && ('upvotes' in payload || 'downvotes' in payload))
      this.votes = this.upvotes - this.downvotes;
  }
}
