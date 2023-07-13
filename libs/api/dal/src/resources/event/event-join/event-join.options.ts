import type { Action } from '../../team/action/action.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { Event } from '../event.entity';
import type { EventJoinProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { User } from '../../individual/user/user.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { EventManage } from '../event-manage/event-manage.entity';
import type { ProcessedVia } from '@okampus/shared/enums';
import type { Individual } from '../../individual/individual.entity';

export type EventJoinOptions = EventJoinProps &
  TenantScopedOptions & {
    isPresent?: boolean | null;
    processedBy?: Individual | null;
    processedAt?: Date | null;
    participationProcessedBy?: Individual | null;
    participationProcessedAt?: Date | null;
    participationProcessedVia?: ProcessedVia | null;
    event: Event;
    joinedBy: User;
    joinedFor?: EventManage | null;
    qrCode?: FileUpload | null;
    actions?: Action[];
    formSubmission?: FormSubmission | null;
  };
