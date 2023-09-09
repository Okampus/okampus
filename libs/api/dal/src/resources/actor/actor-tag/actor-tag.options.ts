import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { TenantScopableOptions } from '../../tenant-scoped.entity';
import type { ActorTagProps } from './actor-tag.props';
import type { Actor } from '../actor.entity';

export type ActorTagOptions = ActorTagProps &
  TenantScopableOptions & {
    actor: Actor;
    image: FileUpload;
  };
