import type { FileUpload } from '../../../resources/file-upload/file-upload.entity';

export type ActorImageUploadOptions = {
  avatar?: FileUpload;
  avatarDark?: FileUpload;
  banner?: FileUpload;
};
