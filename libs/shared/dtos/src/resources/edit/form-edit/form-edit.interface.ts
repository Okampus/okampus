import type { IEdit } from '../edit.interface';
import type { FormEditProps } from './form-edit.props';

export type IFormEdit = IEdit & Required<FormEditProps>;
