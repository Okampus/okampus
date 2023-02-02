import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  TenantCore,
  Project,
  ProjectRepository,
  ProjectOptions,
  Individual,
  User,
  Team,
  TenantEvent,
  TeamRepository,
  TenantEventRepository,
  UserRepository,
} from '@okampus/api/dal';
import { CreateProjectDto, IProject } from '@okampus/shared/dtos';
// import { loadProject } from '../loader.utils';
import { BaseFactory } from '../../base.factory';
import { ProjectModel } from './project.model';
import { asyncCallIfNotNull } from '@okampus/shared/utils';

@Injectable()
export class ProjectFactory extends BaseFactory<ProjectModel, Project, IProject, ProjectOptions> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    projectRepository: ProjectRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private readonly tenantEventRepository: TenantEventRepository
  ) {
    super(ep, projectRepository, ProjectModel, Project);
  }

  async createProject(
    createProject: CreateProjectDto,
    requester: Individual,
    tenant: TenantCore
  ): Promise<ProjectModel> {
    const teamId = createProject.teamId;
    const [team, supervisor, linkedEvent, participants] = await Promise.all([
      this.teamRepository.findOneOrFail({ id: teamId }),
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

  // entityToModel(entity: Project): ProjectModel | undefined {
  //   const project = loadProject(entity);
  //   if (!project) return undefined;
  //   return this.createModel(project);
  // }

  modelToEntity(model: Required<ProjectModel>): Project {
    return new Project({
      ...model,
      team: { id: model.team.id } as Team,
      createdBy: { id: model.createdBy.id } as Individual,
      linkedEvent: model.linkedEvent ? ({ id: model.linkedEvent.id } as TenantEvent) : null,
      participants: model.participants.map((user) => ({ id: user.id } as User)),
      supervisor: { id: model.supervisor.id } as User,
      tenant: { id: model.tenant.id } as TenantCore,
    });
  }
}
