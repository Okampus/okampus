import type { FormEditProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Individual } from '../../actor/individual/individual.entity';
import type { Form } from '../form/form.entity';

export type FormEditOptions = FormEditProps &
  TenantScopedOptions & {
    form: Form;
    editedBy: Individual;
    order: number;
  };
