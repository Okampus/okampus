import { IRole } from '../role.interface';
import { CanteenRoleProps } from './canteen-role.props';

export type ICanteenRole = IRole &
  CanteenRoleProps & {
    // canteen?: ICanteen;
  };
