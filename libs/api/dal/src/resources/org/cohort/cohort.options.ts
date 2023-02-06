import type { OrgOptions } from '../org.options';
import type { CohortProps } from '@okampus/shared/dtos';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';

export type CohortOptions = CohortProps &
  OrgOptions & {
    logo: ImageUpload;
  };
