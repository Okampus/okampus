import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { ActorTagProps } from './actor-tag.props';
import type { Actor } from '../actor.entity';

export type ActorTagOptions = ActorTagProps &
  TenantScopedOptions & {
    actor: Actor;
    image: FileUpload;
  };
