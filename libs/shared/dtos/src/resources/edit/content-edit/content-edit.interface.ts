import type { ContentEditProps } from './content-edit.props';
import type { IEdit } from '../edit.interface';

export type IContentEdit = IEdit & Required<ContentEditProps>;
