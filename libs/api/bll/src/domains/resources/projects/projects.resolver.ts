// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProjectsService } from './projects.service';

import { PaginationOptions } from '../../../shards/types/pagination-options.type';
import { ProjectModel, PaginatedProjectModel } from '../../factories';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CreateProjectDto, UpdateProjectDto } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';

@Resolver(() => ProjectModel)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => ProjectModel)
  projectById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.projectsService.findOneById(id);
  }

  @Query(() => PaginatedProjectModel)
  projects(@Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions) {
    return this.projectsService.find(options);
  }

  @Query(() => PaginatedProjectModel)
  projectsByTeam(
    @Args('teamId', { type: () => String }) teamId: Snowflake,
    @Args('options', { type: () => PaginationOptions, nullable: true }) options: PaginationOptions
  ) {
    return this.projectsService.findByTeam(teamId, options);
  }

  @Mutation(() => ProjectModel)
  createProject(@Args('project', { type: () => CreateProjectDto }) project: CreateProjectDto) {
    return this.projectsService.create(project);
  }

  @Mutation(() => ProjectModel)
  updateProject(@Args('updateProject', { type: () => UpdateProjectDto }) updateProject: UpdateProjectDto) {
    return this.projectsService.update(updateProject);
  }

  @Mutation(() => Boolean)
  deleteProject(@Args('id', { type: () => String }) id: Snowflake) {
    return this.projectsService.delete(id);
  }
}
