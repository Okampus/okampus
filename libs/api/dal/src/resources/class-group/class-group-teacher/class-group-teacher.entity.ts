import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';

import type { ClassGroup } from '../class-group.entity';
import type { Subject } from '../subject/subject.entity';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { ClassGroupTeacherOptions } from './class-group-teacher.options';

@Entity()
export class ClassGroupTeacher extends TenantScopedEntity {
  @ManyToOne({ type: 'UserInfo' })
  user!: UserInfo;

  @ManyToMany({ type: 'Subject' })
  @TransformCollection()
  subject = new Collection<Subject>(this);

  @ManyToOne({ type: 'ClassGroup' })
  classGroup!: ClassGroup;

  @Property({ type: 'datetime' })
  startDate!: Date;

  @Property({ type: 'datetime', nullable: true, default: null })
  endDate: Date | null = null;

  constructor(options: ClassGroupTeacherOptions) {
    super(options);
    this.assign(options);
  }
}
