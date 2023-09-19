import { ProjectSupervisorRepository } from './project-supervisor.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { ProjectSupervisorOptions } from './project-supervisor.options';
import type { Project } from '../project/project.entity';
import type { User } from '../../user/user.entity';

@Entity({ customRepository: () => ProjectSupervisorRepository })
export class ProjectSupervisor extends TenantScopedEntity {
  [EntityRepositoryType]!: ProjectSupervisorRepository;

  @Property({ type: 'text', nullable: true, default: null })
  title: string | null = null;

  @ManyToOne({ type: 'User' })
  user!: User;

  @ManyToOne({ type: 'Project' })
  project!: Project;

  constructor(options: ProjectSupervisorOptions) {
    super(options);
    this.assign(options);
  }
}
