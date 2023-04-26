import type { ClassGroup } from '../class-group.entity';
import type { SubjectProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type SubjectOptions = SubjectProps &
  TenantScopedOptions & {
    lastActiveDate?: Date | null;
    classes?: ClassGroup[];
  };
