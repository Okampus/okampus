import { IFileUpload } from '../file-upload.interface';
export type IVideoUpload = IFileUpload & {
  duration: number | null;
  width: number | null;
  height: number | null;
};
