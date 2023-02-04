import type { IFileUpload } from '../../file-upload/file-upload.interface';
import type { IUgc } from '../ugc.interface';
import type { ContentProps } from './content.props';

export type IContent = IUgc &
  ContentProps & {
    attachments: IFileUpload[];
    parent?: IUgc | null;
    // approvalSteps:
  };
