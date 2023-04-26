import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Form } from '../form.entity';
import type { FormEditProps } from '@okampus/shared/dtos';
import type { JSONObject } from '@okampus/shared/types';

export type FormEditOptions = FormEditProps &
  TenantScopedOptions & {
    addedDiff: JSONObject | null;
    form: Form;
  };
