import { FormEditProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Individual } from '../../actor/individual/individual.entity';
import { Form } from '../form/form.entity';

export type FormEditOptions = FormEditProps &
  TenantScopedOptions & {
    form: Form;
    editedBy: Individual;
    order: number;
  };
