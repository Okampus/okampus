import { FileUploadOptions } from '../file-upload.options';
import { ImageUploadProps } from '@okampus/shared/dtos';

export type ImageUploadOptions = ImageUploadProps &
  FileUploadOptions & {
    width?: number | null;
    height?: number | null;
  };
