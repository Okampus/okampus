import { Org } from '../org.entity';
import { Entity, Enum, Property } from '@mikro-orm/core';
// import { Paginated } from 'libs/api/dal/src/base/abstract/pagination';
// import { TeamRole } from '@api/shards/types/enums/team-role.enum';
// import { Tenant } from '@api/tenants/tenant.entity';
// import { CreateTeamDto } from './dto/create-team.dto';
import { ClassGroupType } from '@okampus/shared/enums';
import { OrgKind } from '@okampus/shared/enums';
import type { ClassGroupOptions } from './class-group.options';

@Entity()
export class ClassGroup extends Org {
  // BaseTenant implements BaseSearchableEntity {
  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Enum({ items: () => ClassGroupType, type: 'string' })
  type!: ClassGroupType;

  // TODO: class delegates
  // TODO: referent admin

  constructor(options: ClassGroupOptions) {
    super({ ...options, orgKind: OrgKind.ClassGroup });
    this.assign({ ...options, orgKind: OrgKind.ClassGroup });
  }
}
