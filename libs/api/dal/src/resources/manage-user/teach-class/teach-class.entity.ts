import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import type { User } from '../../actor/user/user.entity';
import type { Subject } from '../../label/subject/subject.entity';
import type { ClassGroup } from '../../org/class-group/class-group.entity';
import type { TeachClassOptions } from './teach-class.options';

@Entity()
export class TeachClass extends TenantScopedEntity {
  @ManyToOne({ type: 'User' })
  user!: User;

  @ManyToMany({ type: 'Subject' })
  @TransformCollection()
  subject = new Collection<Subject>(this);

  @ManyToOne({ type: 'ClassGroup' })
  classGroup!: ClassGroup;

  @Property({ type: 'datetime' })
  startDate!: Date;

  @Property({ type: 'datetime', nullable: true })
  endDate: Date | null = null;

  constructor(options: TeachClassOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
