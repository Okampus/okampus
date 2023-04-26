import type { TenantProps } from '@okampus/shared/dtos';
import type { Form } from '../form/form.entity';
import type { Upload } from '../upload/upload';

export type TenantOptions = TenantProps & {
  eventValidationForm?: Form | null;
  logo?: Upload | null;
};
