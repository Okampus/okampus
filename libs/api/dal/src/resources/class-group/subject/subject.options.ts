import type { ClassGroup } from '../class-group.entity';
import type { SubjectProps } from './subject.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type SubjectOptions = SubjectProps &
  TenantScopedOptions & {
    classGroups?: ClassGroup[];
  };
