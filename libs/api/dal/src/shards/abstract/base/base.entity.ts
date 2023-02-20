import { PrimaryKey, Property, t } from '@mikro-orm/core';
import { isIn, snowflake } from '@okampus/shared/utils';

export abstract class BaseEntity {
  @PrimaryKey({ type: t.bigint })
  id = snowflake();

  @Property({ type: 'date' })
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: 'date', nullable: true })
  deletedAt: Date | null = null;

  protected assign<T extends object>(options: T): void {
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && isIn(key, this)) this[key] = value;
    }
  }
}
