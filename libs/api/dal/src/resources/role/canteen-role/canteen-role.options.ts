import type { CanteenRoleProps } from '@okampus/shared/dtos';
import type { RoleOptions } from '../role.options';
import type { Canteen } from '../../org/canteen/canteen.entity';

export type CanteenRoleOptions = CanteenRoleProps &
  RoleOptions & {
    canteen: Canteen;
  };
