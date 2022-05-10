import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';

@Entity()
export class Contact extends BaseEntity {
  @PrimaryKey()
  contactId: number;

  @Property()
  name!: string;

  @Property({ type: 'text' })
  icon!: string;

  constructor(options: {
    name: string;
    icon: string;
  }) {
    super();
    this.name = options.name;
    this.icon = options.icon;
  }
}
