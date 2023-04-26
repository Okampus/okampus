import type { Tag } from '../actor/tag/tag.entity';
import type { Event } from '../event/event.entity';
import type { ProjectProps } from '@okampus/shared/dtos';
import type { TeamMember } from '../team/team-member/team-member.entity';
import type { Team } from '../team/team.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { ProjectRole } from './project-role/project-role.entity';
import type { Upload } from '../upload/upload';

export type ProjectOptions = ProjectProps &
  TenantScopedOptions & {
    tags?: Tag[];
    team: Team;
    image?: Upload;
    events?: Event[];
    supervisors: TeamMember[];
    roles?: ProjectRole[];
  };
