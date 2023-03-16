import type { OrgOptions } from '../org.options';
import type { TeamProps } from '@okampus/shared/dtos';
import type { Form } from '../../ugc/form/form.entity';
import type { TeamCategory } from '../../label/team-category/team-category.entity';
import type { VideoUpload } from '../../file-upload/video-upload/video-upload.entity';

export type TeamOptions = TeamProps &
  OrgOptions & {
    joinForm: Form;
    categories?: TeamCategory[];
    video?: VideoUpload;
  };
