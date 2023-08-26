import { ProjectsService } from './projects.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteProjectArgsType,
  DeleteByPkProjectArgsType,
  InsertOneProjectArgsType,
  InsertProjectArgsType,
  UpdateByPkProjectArgsType,
  UpdateProjectArgsType,
  FindProjectArgsType,
  FindByPkProjectArgsType,
  AggregateProjectArgsType,
} from './projects.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('ProjectMutationResponse')
export class ProjectsMutationResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation()
  async insertProject(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertProjectArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.projectsService.insertProject(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateProjectMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateProjectArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.projectsService.updateProjectMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteProject(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteProjectArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.projectsService.deleteProject(getSelectionSet(info), where);
  }
}

@Resolver('Project')
export class ProjectsQueryResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query()
  async project(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindProjectArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.projectsService.findProject(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertProjectOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneProjectArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.projectsService.insertProjectOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async projectByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkProjectArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.projectsService.findProjectByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateProjectByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkProjectArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.projectsService.updateProjectByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteProjectByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkProjectArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.projectsService.deleteProjectByPk(getSelectionSet(info), id);
  }
}

@Resolver('ProjectAggregate')
export class ProjectsQueryAggregateResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query()
  async projectAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateProjectArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.projectsService.aggregateProject(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
