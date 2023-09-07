import type { Event } from '../event.entity';
import type { Project } from '../../team/project/project.entity';
import type { TeamMember } from '../../team/team-member/team-member.entity';
import type { Team } from '../../team/team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';

export type EventOrganizeOptions = TenantScopedOptions & {
  activities?: string;
  supervisors?: TeamMember[];
  event: Event;
  project: Project;
  team: Team;
};
