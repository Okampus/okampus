import type { IUgc } from '../ugc.interface';
import type { FormProps } from './form.props';

export type IForm = IUgc &
  Required<FormProps> & {
    undeletable: boolean;
  };
