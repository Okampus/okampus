import type { IRole } from '../role.interface';
import type { CanteenRoleProps } from './canteen-role.props';

export type ICanteenRole = IRole &
  CanteenRoleProps & {
    // canteen?: ICanteen;
  };
