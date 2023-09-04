import type { Team } from './team.entity';
import type { TeamProps } from './team.props';
import type { TenantScopedOptions } from '../tenant-scoped.entity';
import type { ActorProps } from '../actor/actor.props';
import type { FileUpload } from '../file-upload/file-upload.entity';

export type TeamOptions = TeamProps &
  TenantScopedOptions &
  ActorProps & {
    parent?: Team | null;
    video?: FileUpload;
  };
