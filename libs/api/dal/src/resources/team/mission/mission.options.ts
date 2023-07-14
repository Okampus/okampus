import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Team } from '../team.entity';
import type { MissionProps } from '@okampus/shared/dtos';
import type { EventOrganize } from '../../event/event-organize/event-organize.entity';

export type MissionOptions = TenantScopedOptions &
  MissionProps & {
    team: Team;
    eventManage?: EventOrganize | null;
    project?: Project | null;
  };
