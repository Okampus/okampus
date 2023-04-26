import type { ActorImageType } from '@okampus/shared/enums';
import type { MulterFile } from '@okampus/shared/types';

export type ActorImageUploadProps = {
  [ActorImageType.Avatar]?: MulterFile;
  [ActorImageType.AvatarDarkMode]?: MulterFile;
  [ActorImageType.Banner]?: MulterFile;
};
