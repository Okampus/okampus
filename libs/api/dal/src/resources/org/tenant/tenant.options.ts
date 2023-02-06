import type { TenantProps } from '@okampus/shared/dtos';
import type { Form } from '../../ugc/form/form.entity';
import type { OrgOptions } from '../org.options';

export type TenantOptions = TenantProps &
  OrgOptions & {
    eventValidationForm?: Form | null;
  };
