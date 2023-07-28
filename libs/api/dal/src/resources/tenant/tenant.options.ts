import type { TenantProps } from './tenant.props';
import type { Form } from '../form/form.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';

export type TenantOptions = TenantProps & {
  eventValidationForm?: Form | null;
  logo?: FileUpload | null;
};
