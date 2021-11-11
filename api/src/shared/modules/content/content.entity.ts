import {
  BeforeUpdate,
  EventArgs,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { User } from '../../../users/user.entity';

export abstract class Content {
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

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  @Exclude()
  updatedAt = new Date();

  constructor(options: {
    body: string;
    author: User;
  }) {
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
