import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from '@meta/shared/lib/entities/base.entity';

@Entity()
export class Wiki extends BaseEntity {
  @PrimaryKey()
  id!: number;

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
    hidden?: boolean | null;
  }) {
    super();
    this.assign(options);
  }
}
