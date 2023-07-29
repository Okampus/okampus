import type { ValidationProps } from './validation.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Content } from '../content.entity';

export type ValidationOptions = ValidationProps &
  TenantScopedOptions & {
    content?: Content | null;
  };
