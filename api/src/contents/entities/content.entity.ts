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
import { Exclude, Transform } from 'class-transformer';
import { CONTENT_AUTHOR_EXCLUDED } from '../../shared/lib/constants';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
// eslint-disable-next-line import/no-cycle
import { ContentMaster } from '../../shared/lib/entities/content-master.entity';
import { ContentKind } from '../../shared/lib/types/content-kind.enum';
import { ContentMasterType } from '../../shared/lib/types/content-master-type.enum';
import { User } from '../../users/user.entity';
// eslint-disable-next-line import/no-cycle
import { ContentEdit } from './content-edit.entity';

@Entity()
export class Content extends BaseEntity {
  @PrimaryKey()
  contentId!: number;

  @Property({ type: 'text' })
  body!: string;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Transform(({ obj }: { obj: Content }) => obj.author.userId, { groups: [CONTENT_AUTHOR_EXCLUDED] })
  author!: User;

  @Property()
  upvotes = 0;

  @Property()
  @Transform(({ obj }: { obj: Content }) => (obj.kind === ContentKind.Comment ? undefined : obj.downvotes))
  downvotes = 0;

  @Property()
  votes = 0;

  @Enum(() => ContentKind)
  @Index()
  kind!: ContentKind;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Transform(({ obj }: { obj: Content }) => ({ contentId: obj.parent?.contentId, kind: obj.parent?.kind }))
  parent?: Content;

  @OneToMany(() => Content, content => content.parent)
  @TransformCollection()
  children = new Collection<Content>(this);

  @OneToMany(() => ContentEdit, edit => edit.parent)
  @TransformCollection()
  @Exclude()
  edits = new Collection<ContentEdit>(this);

  @Enum(() => ContentMasterType)
  contentMasterType!: ContentMasterType;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Exclude()
  contentMaster!: ContentMaster;

  @Property({ persist: false })
  contentMasterId!: number;

  @Property()
  hidden = false;

  @Property()
  isVisible = true;

  @Property()
  reportCount = 0;

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
