import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, Enum, Index, ManyToMany, Property } from '@mikro-orm/core';
import { SubjectType } from '@okampus/shared/enums';
import type { ClassGroup } from '../../org/class-group/class-group.entity';
import type { SubjectOptions } from './subject.options';

@Entity()
export class Subject extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  englishName!: string;

  @Index()
  @Property({ type: 'text' })
  code!: string; // TODO: implement unique by tenant

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Enum({ items: () => SubjectType, type: 'string' })
  type!: SubjectType;

  @ManyToMany({ type: 'ClassGroup' })
  @TransformCollection()
  linkedClasses = new Collection<ClassGroup>(this);

  @Property({ type: 'datetime', nullable: true })
  lastActiveDate: Date | null = null;

  constructor(options: SubjectOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
