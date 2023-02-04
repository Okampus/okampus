import { Entity, Enum, Property } from '@mikro-orm/core';
// import { Paginated } from 'libs/api/dal/src/base/abstract/pagination';
// import { TeamRole } from '@api/shards/types/enums/team-role.enum';
// import { Tenant } from '@api/tenants/tenant.entity';
// import { CreateTeamDto } from './dto/create-team.dto';
import { RoleKind } from '@okampus/shared/enums';
import { Colors } from '@okampus/shared/enums';
import type { RoleOptions } from './role.options';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
// import { TeamRoleOptions } from './team-role.options';

// const ADMIN_ROLES = new Set([
//   TeamRole.Owner,
//   TeamRole.Coowner,
//   TeamRole.Treasurer,
//   TeamRole.Secretary,
// ]);

// const MANAGER_ROLES = new Set([
//   TeamRole.Owner,
//   TeamRole.Coowner,
//   TeamRole.Treasurer,
//   TeamRole.Secretary,
//   TeamRole.Manager,
// ]);

@Entity({
  discriminatorColumn: 'roleKind',
  discriminatorMap: RoleKind,
  abstract: true,
})
export class Role extends TenantScopedEntity {
  @Enum(() => RoleKind)
  roleKind!: RoleKind;

  @Property({ type: 'text' })
  name!: string;

  // @Enum({ default: [], array: true })
  // permissions: TeamPermissions[] = [];

  // @Enum(() => TeamRoleCategory)
  // category!: TeamRoleCategory;

  @Enum(() => Colors)
  color!: Colors;

  @Property({ type: 'boolean' })
  required = false; // TODO: create required roles programmatically on team creation (e.g. owner, treasurer, secretary)

  constructor(options: RoleOptions & { roleKind: RoleKind }) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
