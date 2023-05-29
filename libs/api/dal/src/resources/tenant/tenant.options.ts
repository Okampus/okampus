import type { TenantProps } from '@okampus/shared/dtos';
import type { Form } from '../form/form.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';

export type TenantOptions = TenantProps & {
  eventValidationForm?: Form | null;
  logo?: FileUpload | null;
};
