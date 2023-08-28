import { ClassGroupTeacherRepository } from './class-group-teacher.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { User } from '../../user/user.entity';
import { ClassGroup } from '../class-group.entity';
import { TransformCollection } from '@okampus/api/shards';
import { Collection, Entity, EntityRepositoryType, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';

import type { ClassGroupTeacherOptions } from './class-group-teacher.options';
import type { Subject } from '../subject/subject.entity';

@Entity({ customRepository: () => ClassGroupTeacherRepository })
export class ClassGroupTeacher extends TenantScopedEntity {
  [EntityRepositoryType]!: ClassGroupTeacherRepository;

  @ManyToOne({ type: 'User' })
  user!: User;

  @ManyToMany({ type: 'Subject' })
  @TransformCollection()
  subjects = new Collection<Subject>(this);

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
