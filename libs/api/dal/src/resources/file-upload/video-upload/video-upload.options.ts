import type { FileUploadOptions } from '../file-upload.options';
import type { VideoUploadProps } from '@okampus/shared/dtos';

export type VideoUploadOptions = VideoUploadProps &
  FileUploadOptions & {
    duration?: number;
    width?: number;
    height?: number;
  };
