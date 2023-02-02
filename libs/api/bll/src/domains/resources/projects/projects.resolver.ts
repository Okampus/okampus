import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateProjectDto, UpdateProjectDto } from '@okampus/shared/dtos';
import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { Snowflake } from '@okampus/shared/types';
import { ProjectsService } from './projects.service';
import { ProjectModel, PaginatedProjectModel } from '../../factories/domains/teams/project.model';

@Resolver(() => ProjectModel)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => ProjectModel)
  projectById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.projectsService.findOneById(id);
  }

  @Query(() => PaginatedProjectModel)
  projects(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.projectsService.find(options);
  }

  @Query(() => PaginatedProjectModel)
  projectsByTeam(@Args('teamId') teamId: string, @Args('options', { nullable: true }) options: PaginationOptions) {
    return this.projectsService.findByTeam(teamId, options);
  }

  @Mutation(() => ProjectModel)
  createProject(@Args('project') project: CreateProjectDto) {
    return this.projectsService.create(project);
  }

  @Mutation(() => ProjectModel)
  updateProject(@Args('updateProject') updateProject: UpdateProjectDto) {
    return this.projectsService.update(updateProject);
  }

  @Mutation(() => Boolean)
  deleteProject(@Args('id', { type: () => String }) id: Snowflake) {
    return this.projectsService.delete(id);
  }
}
