import { ManyToOne, PrimaryKey, Property, t } from '@mikro-orm/core';
import { isIn } from '@okampus/shared/utils';

import type { User } from './user/user.entity';

export abstract class BaseEntity {
  @PrimaryKey({ type: t.bigint, defaultRaw: '"public"."snowflake"()', autoincrement: false })
  id!: string;

  @Property({ type: 'datetime', defaultRaw: 'current_timestamp' })
  createdAt!: Date;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  createdBy: User | null = null; // null for system

  @Property({ type: 'datetime', nullable: true, default: null })
  deletedAt: Date | null = null;

  protected assign<T extends object>(options: T): void {
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && isIn(key, this)) this[key] = value;
    }
  }
}
