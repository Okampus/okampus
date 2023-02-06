import type { FileUploadOptions } from '../file-upload.options';
import type { ImageUploadProps } from '@okampus/shared/dtos';

export type ImageUploadOptions = ImageUploadProps &
  FileUploadOptions & {
    width?: number | null;
    height?: number | null;
  };
