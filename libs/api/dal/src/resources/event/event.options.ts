import type { Tag } from '../actor/tag/tag.entity';
import type { Team } from '../team/team.entity';
import type { Event } from './event.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { EventProps } from './event.props';
import type { FormSubmission } from '../form-submission/form-submission.entity';
import type { Form } from '../form/form.entity';
import type { EventApprovalStep } from '../tenant/event-approval-step/event-approval-step.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { EventOrganize } from './event-organize/event-organize.entity';
import type { Location } from '../actor/location/location.entity';

export type EventOptions = EventProps &
  TenantScopedOptions & {
    location?: Location | null;
    banner?: FileUpload | null;
    joinForm?: Form | null;
    regularEvent?: Event | null;
    eventApprovalSubmission?: FormSubmission | null;
    nextEventApprovalStep?: EventApprovalStep | null;
    tags?: Tag[];
    teams?: Team[];
    eventOrganizes?: EventOrganize[];
  };
