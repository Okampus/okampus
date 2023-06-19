import type { Action } from '../../team/action/action.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { Event } from '../event.entity';
import type { EventJoinProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { EventManage } from '../event-manage/event-manage.entity';
import type { MissionJoin } from '../../team/mission-join/mission-join.entity';
import type { SettledVia } from '@okampus/shared/enums';
import type { Individual } from '../../individual/individual.entity';

export type EventJoinOptions = EventJoinProps &
  TenantScopedOptions & {
    presence?: boolean | null;
    settledBy?: Individual | null;
    settledAt?: Date | null;
    presenceSettledBy?: Individual | null;
    presenceSettledAt?: Date | null;
    presenceSettledVia?: SettledVia | null;
    event: Event;
    joiner: UserInfo;
    joinedFor?: EventManage | null;
    qrCode?: FileUpload | null;
    missionJoin?: MissionJoin | null;
    action?: Action | null;
    formSubmission?: FormSubmission | null;
  };
