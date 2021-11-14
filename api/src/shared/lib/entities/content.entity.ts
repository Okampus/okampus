import {
  BeforeUpdate,
  EventArgs,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { User } from '../../../users/user.entity';
import { BaseEntity } from './base.entity';

export abstract class Content extends BaseEntity {
  @Property({ type: 'text' })
  body!: string;

  @ManyToOne()
  author!: User;

  @Property()
  upvotes = 0;

  @Property()
  downvotes = 0;

  @Property()
  contentLastUpdatedAt = new Date();

  constructor(options: {
    body: string;
    author: User;
  }) {
    super();
    this.body = options.body;
    this.author = options.author;
  }

  @BeforeUpdate()
  public beforeUpdate(event: EventArgs<this>): void {
    const payload = event.changeSet?.payload;
    if (payload && 'body' in payload)
      this.contentLastUpdatedAt = new Date();
  }
}
