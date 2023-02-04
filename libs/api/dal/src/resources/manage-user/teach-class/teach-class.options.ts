import type { TeachClassProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { User } from '../../actor/user/user.entity';
import type { Subject } from '../../label/subject/subject.entity';
import type { ClassGroup } from '../../org/class-group/class-group.entity';

export type TeachClassOptions = TeachClassProps &
  TenantScopedOptions & {
    user: User;
    subject: Subject[];
    classgroup: ClassGroup;
  };
