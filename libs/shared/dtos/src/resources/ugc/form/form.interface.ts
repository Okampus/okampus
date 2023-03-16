import type { IFormEdit } from '../form-edit/form-edit.interface';
import type { IUgc } from '../ugc.interface';
import type { FormProps } from './form.props';

export type IForm = IUgc &
  Required<FormProps> & {
    edits: IFormEdit[];
    undeletable: boolean;
  };
