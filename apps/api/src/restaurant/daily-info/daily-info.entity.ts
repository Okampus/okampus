import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';

@Entity()
export class DailyInfo extends BaseEntity {
  @PrimaryKey()
  date!: Date;

  @Property({ type: 'text' })
  content!: string;

  constructor(options: {
    content: string;
    date: Date;
  }) {
    super();
    this.content = options.content;
    this.date = options.date;
  }
}
