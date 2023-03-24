import { Role } from '../role.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RoleKind } from '@okampus/shared/enums';

import type { ProjectRoleOptions } from './project-role.options';
import type { Project } from '../../manage-team/project/project.entity';

@Entity()
export class ProjectRole extends Role {
  @ManyToOne({ type: 'Project' })
  project!: Project;

  @Property({ type: 'text' })
  description!: string;

  @Property({ type: 'boolean' })
  autoAccept = true;

  @Property({ type: 'smallint' })
  rewardMinimum = 1;

  @Property({ type: 'smallint' })
  rewardMaximum = 3;

  constructor(options: ProjectRoleOptions) {
    super({ ...options, roleKind: RoleKind.ProjectRole });
    this.assign({ ...options, roleKind: RoleKind.ProjectRole });
  }
}
