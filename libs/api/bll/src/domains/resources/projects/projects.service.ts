import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectDto, UpdateProjectDto } from '@okampus/shared/dtos';
import { Snowflake } from '@okampus/shared/types';
import { RequestContext } from '../../../shards/request-context/request-context';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { ProjectModel, PaginatedProjectModel } from '../../factories/domains/teams/project.model';
import { CreateProjectCommand } from './commands/create-project/create-project.command';
import { DeleteProjectCommand } from './commands/delete-project/delete-project.command';
import { UpdateProjectCommand } from './commands/update-project/update-project.command';
import { GetProjectByIdQuery } from './queries/get-project-by-id/get-project-by-id.query';
import { GetProjectsByTeamQuery } from './queries/get-projects-by-team/get-projects-by-team.query';
import { GetProjectsQuery } from './queries/get-projects/get-projects.query';

const defaultProjectPopulate = ['actor', 'actor.images', 'actor.socials', 'actor.tags'];

@Injectable()
export class ProjectsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<ProjectModel> {
    const query = new GetProjectByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultProjectPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedProjectModel> {
    const query = new GetProjectsQuery(paginationOptions, this.tenant(), this.autoGqlPopulate(defaultProjectPopulate));
    return this.queryBus.execute(query);
  }

  findByTeam(teamId: string, paginationOptions: PaginationOptions): Promise<PaginatedProjectModel> {
    const query = new GetProjectsByTeamQuery(
      teamId,
      paginationOptions,
      this.tenant(),
      this.autoGqlPopulate(defaultProjectPopulate)
    );
    return this.queryBus.execute(query);
  }

  create(createProject: CreateProjectDto): Promise<ProjectModel> {
    const command = new CreateProjectCommand(createProject, this.requester(), this.tenant());
    return this.commandBus.execute(command);
  }

  update(updateProject: UpdateProjectDto): Promise<ProjectModel> {
    const command = new UpdateProjectCommand(
      updateProject,
      this.tenant(),
      this.autoGqlPopulate(defaultProjectPopulate)
    );
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteProjectCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
