import { TeachClassProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { User } from '../../actor/user/user.entity';
import { Subject } from '../../label/subject/subject.entity';
import { ClassGroup } from '../../org/class-group/class-group.entity';

export type TeachClassOptions = TeachClassProps &
  TenantScopedOptions & {
    user: User;
    subject: Subject[];
    classgroup: ClassGroup;
  };
