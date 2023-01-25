import { IFileUpload } from '../file-upload.interface';
export type IImageUpload = IFileUpload & {
  width: number | null;
  height: number | null;
};
