import type { Action } from '../../team/action/action.entity';
import type { FormSubmission } from '../../form/form-submission/form-submission.entity';
import type { Event } from '../event.entity';
import type { EventJoinProps } from './event-join.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { User } from '../../user/user.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { EventOrganize } from '../event-organize/event-organize.entity';
import type { ProcessedVia } from '@okampus/shared/enums';

export type EventJoinOptions = EventJoinProps &
  TenantScopedOptions & {
    isPresent?: boolean | null;
    processedBy?: User | null;
    processedAt?: Date | null;
    participationProcessedBy?: User | null;
    participationProcessedAt?: Date | null;
    participationProcessedVia?: ProcessedVia | null;
    event: Event;
    joinedBy: User;
    joinedFor?: EventOrganize | null;
    qrCode?: FileUpload | null;
    actions?: Action[];
    formSubmission?: FormSubmission | null;
  };
