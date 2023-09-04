import type { Project } from '../../team/project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { Team } from '../team.entity';
import type { MissionProps } from './mission.props';
import type { EventOrganize } from '../../event/event-organize/event-organize.entity';

export type MissionOptions = TenantScopedOptions &
  MissionProps & {
    team: Team;
    eventManage?: EventOrganize | null;
    project?: Project | null;
  };
