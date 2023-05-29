import type { ClassGroupTeacherProps } from '@okampus/shared/dtos';
import type { Subject } from '../subject/subject.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ClassGroup } from '../class-group.entity';
import type { UserInfo } from '../../individual/user-info/user-info.entity';

export type ClassGroupTeacherOptions = ClassGroupTeacherProps &
  TenantScopedOptions & {
    user: UserInfo;
    subjects: Subject[];
    classgroup: ClassGroup;
  };
