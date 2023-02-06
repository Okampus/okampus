import type { ImageUpload } from '../../../resources/file-upload/image-upload/image-upload.entity';

export type ActorImageUploadOptions = {
  avatar?: ImageUpload;
  avatarDark?: ImageUpload;
  banner?: ImageUpload;
};
