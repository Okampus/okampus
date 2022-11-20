import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';

@Entity()
export class DailyInfo extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  @Index()
  date!: Date;

  @Property({ type: 'text' })
  content!: string;

  constructor(options: {
    content: string;
    date: Date;
  }) {
    super();
    this.assign(options);
  }
}
