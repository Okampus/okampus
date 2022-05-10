import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Exclude, Transform } from 'class-transformer';
import { CONTENT_AUTHOR_EXCLUDED } from '../../shared/lib/constants';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../../users/user.entity';
// eslint-disable-next-line import/no-cycle
import { Content } from './content.entity';

@Entity()
export class ContentEdit extends BaseEntity {
  @PrimaryKey()
  contentEditId!: number;

  @Property({ type: 'text' })
  body!: string;

  @Property()
  editOrder!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Exclude()
  parent!: Content;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Transform(({ obj }: { obj: ContentEdit }) => obj.editedBy.userId, { groups: [CONTENT_AUTHOR_EXCLUDED] })
  editedBy!: User;

  constructor(options: {
    body: string;
    parent: Content;
    editedBy: User;
    editOrder: number;
  }) {
    super();
    this.body = options.body;
    this.parent = options.parent;
    this.editedBy = options.editedBy;
    this.editOrder = options.editOrder;
  }
}
