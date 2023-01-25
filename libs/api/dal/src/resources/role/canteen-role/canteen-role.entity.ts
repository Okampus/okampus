import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { CanteenPermissions, RoleKind } from '@okampus/shared/enums';
import { Role } from '../role.entity';
import type { Canteen } from '../../org/canteen/canteen.entity';
import { CanteenRoleOptions } from './canteen-role.options';

@Entity()
export class CanteenRole extends Role {
  @ManyToOne({ type: 'Canteen' })
  canteen!: Canteen;

  @Enum({ default: [], array: true })
  permissions: CanteenPermissions[] = [];

  constructor(options: CanteenRoleOptions) {
    super({ ...options, roleKind: RoleKind.CanteenRole });
    this.assign({ ...options, roleKind: RoleKind.CanteenRole });
  }
}
