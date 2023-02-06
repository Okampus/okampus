import { Role } from '../role.entity';
import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { RoleKind } from '@okampus/shared/enums';
import { CanteenPermissions } from '@okampus/shared/enums';
import type { Canteen } from '../../org/canteen/canteen.entity';
import type { CanteenRoleOptions } from './canteen-role.options';

@Entity()
export class CanteenRole extends Role {
  @ManyToOne({ type: 'Canteen' })
  canteen!: Canteen;

  @Enum({ items: () => CanteenPermissions, type: 'string', default: [], array: true })
  permissions: CanteenPermissions[] = [];

  constructor(options: CanteenRoleOptions) {
    super({ ...options, roleKind: RoleKind.CanteenRole });
    this.assign({ ...options, roleKind: RoleKind.CanteenRole });
  }
}
