import type { Tag } from '../actor/tag/tag.entity';
import type { ProjectProps } from '@okampus/shared/dtos';
import type { TeamMember } from '../team/team-member/team-member.entity';
import type { Team } from '../team/team.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { FileUpload } from '../file-upload/file-upload.entity';

export type ProjectOptions = ProjectProps &
  TenantScopedOptions & {
    tags?: Tag[];
    team: Team;
    image?: FileUpload;
    supervisors: TeamMember[];
  };
