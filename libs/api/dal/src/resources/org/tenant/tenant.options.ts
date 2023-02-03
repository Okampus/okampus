import { TenantProps } from '@okampus/shared/dtos';
import { Form } from '../../ugc/form/form.entity';
import { OrgOptions } from '../org.options';

export type TenantOptions = TenantProps &
  OrgOptions & {
    eventValidationForm?: Form | null;
  };
