import type { ClassGroupTeacherProps } from './class-group-teacher.props';
import type { Subject } from '../subject/subject.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ClassGroup } from '../class-group.entity';
import type { User } from '../../individual/user/user.entity';

export type ClassGroupTeacherOptions = ClassGroupTeacherProps &
  TenantScopedOptions & {
    user: User;
    subjects: Subject[];
    classgroup: ClassGroup;
  };
