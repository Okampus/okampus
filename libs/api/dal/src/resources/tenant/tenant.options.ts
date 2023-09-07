import type { TenantProps } from './tenant.props';
import type { Form } from '../form/form.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { ActorProps } from '../actor/actor.props';

export type TenantOptions = TenantProps &
  ActorProps & {
    eventValidationForm?: Form | null;
    logo?: FileUpload | null;
  };
