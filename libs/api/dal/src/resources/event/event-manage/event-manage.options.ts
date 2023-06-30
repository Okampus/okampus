import type { TeamMember } from '../../team/team-member/team-member.entity';
import type { Team } from '../../team/team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Event } from '../event.entity';

export type EventManageOptions = TenantScopedOptions & {
  activities?: string;
  supervisors?: TeamMember[];
  event: Event;
  team: Team;
};
