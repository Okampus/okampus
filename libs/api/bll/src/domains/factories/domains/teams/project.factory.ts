import { ProjectModel } from './project.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProjectRepository, TeamRepository, TenantEventRepository, UserRepository } from '@okampus/api/dal';
import { Project, TenantCore, Individual, User, Team, TenantEvent } from '@okampus/api/dal';
import { asyncCallIfNotNull } from '@okampus/shared/utils';

import type { ProjectOptions } from '@okampus/api/dal';
import type { CreateProjectDto, IProject } from '@okampus/shared/dtos';

@Injectable()
export class ProjectFactory extends BaseFactory<ProjectModel, Project, IProject, ProjectOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    projectRepository: ProjectRepository,
    uploadService: UploadService,
    private readonly em: EntityManager,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private readonly tenantEventRepository: TenantEventRepository
  ) {
    super(eventPublisher, uploadService, projectRepository, ProjectModel, Project);
  }

  async createProject(
    createProject: CreateProjectDto,
    requester: Individual,
    tenant: TenantCore
  ): Promise<ProjectModel> {
    const [team, supervisor, linkedEvent, participants] = await Promise.all([
      this.teamRepository.findOneOrFail({ id: createProject.teamId }),
      this.userRepository.findOneOrFail({ id: createProject.supervisorId }),
      asyncCallIfNotNull(createProject.linkedEventId, (id) => this.tenantEventRepository.findOneOrFail({ id })),
      asyncCallIfNotNull(createProject.participantsIds, (ids) => this.userRepository.findByIds(ids)),
    ]);

    return this.create({
      ...createProject,
      createdBy: requester,
      team,
      supervisor,
      linkedEvent,
      participants: participants ?? [],
      tenant,
    });
  }

  modelToEntity(model: Required<ProjectModel>): Project {
    return new Project({
      ...model,
      team: this.em.getReference(Team, model.team.id),
      createdBy: this.em.getReference(Individual, model.createdBy.id),
      linkedEvent: model.linkedEvent ? this.em.getReference(TenantEvent, model.linkedEvent.id) : null,
      participants: model.participants.map((user) => this.em.getReference(User, user.id)),
      supervisor: this.em.getReference(User, model.supervisor.id),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
