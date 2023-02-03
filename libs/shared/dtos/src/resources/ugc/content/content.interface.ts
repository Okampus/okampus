import { IFileUpload } from '../../file-upload/file-upload.interface';
import { IUgc } from '../ugc.interface';
import { ContentProps } from './content.props';

export type IContent = IUgc &
  ContentProps & {
    attachments: IFileUpload[];
    parent?: IUgc | null;
    // approvalSteps:
  };
