// eslint-disable-next-line import/no-cycle
import { ProjectModel } from '../../index';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  ProjectRepository,
  TeamMember,
  TeamMemberRepository,
  TeamRepository,
  TenantEventRepository,
  UserRepository,
} from '@okampus/api/dal';
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
    private readonly teamMemberRepository: TeamMemberRepository,
    private readonly tenantEventRepository: TenantEventRepository
  ) {
    super(eventPublisher, uploadService, projectRepository, ProjectModel, Project);
  }

  async createProject(
    createProject: CreateProjectDto,
    requester: Individual,
    tenant: TenantCore
  ): Promise<ProjectModel> {
    const [team, linkedEvents, supervisors, participants] = await Promise.all([
      this.teamRepository.findOneOrFail({ id: createProject.teamId }),
      asyncCallIfNotNull(createProject.linkedEventIds, (ids) => this.tenantEventRepository.findByIds(ids)),
      asyncCallIfNotNull(createProject.supervisorIds, (ids) => this.teamMemberRepository.findByIds(ids)),
      asyncCallIfNotNull(createProject.participantsIds, (ids) => this.userRepository.findByIds(ids)),
    ]);

    return this.create({
      ...createProject,
      createdBy: requester,
      team,
      supervisors: supervisors ?? [],
      linkedEvents: linkedEvents ?? [],
      participants: participants ?? [],
      tenant,
    });
  }

  modelToEntity(model: Required<ProjectModel>): Project {
    return new Project({
      ...model,
      team: this.em.getReference(Team, model.team.id),
      linkedEvents: model.linkedEvents.map((event) => this.em.getReference(TenantEvent, event.id)),
      participants: model.participants.map((user) => this.em.getReference(User, user.id)),
      supervisors: model.supervisors.map((supervisor) => this.em.getReference(TeamMember, supervisor.id)),
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
