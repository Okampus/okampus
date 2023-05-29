import { ManyToOne, PrimaryKey, Property, t } from '@mikro-orm/core';
import { isIn } from '@okampus/shared/utils';

import type { Individual } from './individual/individual.entity';

export abstract class BaseEntity {
  @PrimaryKey({ type: t.bigint, defaultRaw: '"public"."id_generator"()', autoincrement: false })
  id!: string;

  @Property({ type: 'date', defaultRaw: 'current_timestamp' })
  createdAt!: Date;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  createdBy: Individual | null = null; // null for system

  @Property({ type: 'date', nullable: true, default: null })
  deletedAt: Date | null = null;

  protected assign<T extends object>(options: T): void {
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && isIn(key, this)) this[key] = value;
    }
  }
}
