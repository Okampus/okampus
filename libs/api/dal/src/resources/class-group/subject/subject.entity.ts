import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, Enum, EnumType, Index, ManyToMany, Property } from '@mikro-orm/core';
import { SubjectType } from '@okampus/shared/enums';

import type { ClassGroup } from '../class-group.entity';
import type { SubjectOptions } from './subject.options';

@Entity()
export class Subject extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true, default: null })
  englishName!: string;

  @Property({ type: 'text', nullable: true, default: null })
  description: string | null = null;

  @Index() // TODO: implement unique by tenant
  @Property({ type: 'text' })
  code!: string;

  @Enum({ items: () => SubjectType, type: EnumType })
  type!: SubjectType;

  @Property({ type: 'datetime', nullable: true, default: null })
  lastActiveDate: Date | null = null;

  @ManyToMany({ type: 'ClassGroup' })
  @TransformCollection()
  classes = new Collection<ClassGroup>(this);

  constructor(options: SubjectOptions) {
    super(options);
    this.assign(options);
  }
}
