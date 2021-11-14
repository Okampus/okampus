import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryKey({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  color!: string;

  @Property({ type: 'text' })
  description?: string;

  constructor(options: { name: string; color: string; description?: string }) {
    super();
    this.name = options.name;
    this.color = options.color;
    this.description = options.description;
  }
}
