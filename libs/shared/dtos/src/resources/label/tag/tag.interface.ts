import type { TagKind } from '@okampus/shared/enums';
import type { IIndividual } from '../../actor/individual/individual.interface';
import type { IImageUpload } from '../../file-upload/image-upload/image-upload.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { TagProps } from './tag.props';

export type ITag = ITenantScoped &
  TagProps & {
    tagKind: TagKind;
    iconImage?: IImageUpload | null;
    createdBy?: IIndividual | null; // null for system
  };
