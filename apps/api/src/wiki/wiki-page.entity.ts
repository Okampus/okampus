import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';

@Entity()
export class WikiPage extends BaseEntity {
  @PrimaryKey()
  wikiPageId!: number;

  @Property({ type: 'text' })
  title!: string;

  @Property({ type: 'text' })
  body!: string;

  @Property({ type: 'text' })
  category!: string;

  @Property()
  hidden = false;

  constructor(options: {
    title: string;
    body: string;
    category: string;
    hidden?: boolean;
  }) {
    super();
    this.title = options.title;
    this.body = options.body;
    this.category = options.category;
    if (options.hidden)
      this.hidden = options.hidden;
  }
}
