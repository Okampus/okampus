import type { Project } from '../../project/project.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Team } from '../team.entity';
import type { MissionProps } from '@okampus/shared/dtos';
import type { EventManage } from '../../event/event-manage/event-manage.entity';

export type MissionOptions = TenantScopedOptions &
  MissionProps & {
    team: Team;
    eventManage?: EventManage | null;
    project?: Project | null;
  };
