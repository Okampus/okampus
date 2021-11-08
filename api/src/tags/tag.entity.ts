import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

@Entity()
export class Tag {
  @PrimaryKey({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  color!: string;

  @Property({ type: 'text' })
  description?: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  @Exclude()
  updatedAt = new Date();

  constructor(options: { name: string; color: string; description?: string }) {
    this.name = options.name;
    this.color = options.color;
    this.description = options.description;
  }
}
