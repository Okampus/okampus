import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { Colors } from '../shared/lib/types/enums/colors.enum';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryKey({ type: 'text' })
  name!: string;

  @Enum(() => Colors)
  color!: Colors;

  @Property({ type: 'text' })
  description?: string;

  constructor(options: { name: string; color: Colors; description?: string }) {
    super();
    this.name = options.name;
    this.color = options.color;
    this.description = options.description;
  }
}
