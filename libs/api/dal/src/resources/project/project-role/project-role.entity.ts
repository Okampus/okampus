import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Colors } from '@okampus/shared/enums';
import { Entity, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';

import type { ProjectRoleOptions } from './project-role.options';
import type { Project } from '../project.entity';

@Entity()
export class ProjectRole extends TenantScopedEntity {
  @Property({ type: 'text' })
  description!: string;

  @Property({ type: 'boolean' })
  autoAccept = true;

  @Property({ type: 'smallint' })
  rewardMinimum = 1;

  @Property({ type: 'smallint' })
  rewardMaximum = 3;

  @Property({ type: 'text' })
  name!: string;

  @Enum({ items: () => Colors, type: EnumType })
  color!: Colors;

  @Property({ type: 'boolean' })
  required = false;

  @ManyToOne({ type: 'Project' })
  project!: Project;

  constructor(options: ProjectRoleOptions) {
    super(options);
    this.assign(options);
  }
}
