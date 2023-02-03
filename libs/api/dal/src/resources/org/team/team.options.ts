import { OrgOptions } from '../org.options';
import { TeamProps } from '@okampus/shared/dtos';
import { Form } from '../../ugc/form/form.entity';
import { TeamCategory } from '../../label/team-category/team-category.entity';
import { VideoUpload } from '../../file-upload/video-upload/video-upload.entity';

export type TeamOptions = TeamProps &
  OrgOptions & {
    categories?: TeamCategory[];
    video?: VideoUpload;
    joinForm?: Form | null;
  };
