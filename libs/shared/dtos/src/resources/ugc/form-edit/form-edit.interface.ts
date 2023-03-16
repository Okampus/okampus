import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { IIndividual } from '../../actor/individual/individual.interface';
import type { IForm } from '../form/form.interface';
import type { FormEditProps } from './form-edit.props';

export type IFormEdit = ITenantScoped &
  Required<FormEditProps> & {
    editedBy?: IIndividual | null;
    linkedForm?: IForm;
    order: number;
  };
