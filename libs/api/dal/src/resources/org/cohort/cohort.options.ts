import { OrgOptions } from '../org.options';
import { CohortProps } from '@okampus/shared/dtos';
import { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';

export type CohortOptions = CohortProps &
  OrgOptions & {
    logo: ImageUpload;
  };
