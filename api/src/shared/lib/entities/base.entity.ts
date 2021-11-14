import { Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity {
  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  @Exclude()
  updatedAt = new Date();
}
