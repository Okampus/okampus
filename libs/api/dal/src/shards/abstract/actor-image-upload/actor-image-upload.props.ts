import { ActorImageType } from '@okampus/shared/enums';
import { MulterFileType } from '@okampus/shared/types';

export type ActorImageUploadProps = {
  [ActorImageType.Avatar]?: MulterFileType;
  [ActorImageType.AvatarDarkMode]?: MulterFileType;
  [ActorImageType.Banner]?: MulterFileType;
};
