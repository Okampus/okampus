import type { ValidationProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Content } from '../content.entity';

export type ValidationOptions = ValidationProps &
  TenantScopedOptions & {
    lastActiveDate?: Date | null;
    content?: Content | null;
  };
