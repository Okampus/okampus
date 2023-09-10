import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { EventOrganize } from '../event-organize/event-organize.entity';
import type { TeamMember } from '../../team/team-member/team-member.entity';

export type EventSupervisorOptions = TenantScopedOptions & {
  eventOrganize: EventOrganize;
  teamMember: TeamMember;
  title?: string;
};
