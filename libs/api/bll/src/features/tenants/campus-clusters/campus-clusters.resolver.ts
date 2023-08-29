import { CampusClustersService } from './campus-clusters.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteCampusClusterArgsType,
  DeleteByPkCampusClusterArgsType,
  InsertOneCampusClusterArgsType,
  InsertCampusClusterArgsType,
  UpdateByPkCampusClusterArgsType,
  UpdateCampusClusterArgsType,
  FindCampusClusterArgsType,
  FindByPkCampusClusterArgsType,
  AggregateCampusClusterArgsType,
} from './campus-clusters.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('CampusClusterMutationResponse')
export class CampusClustersMutationResolver {
  constructor(private readonly campusClustersService: CampusClustersService) {}

  @Mutation()
  async insertCampusCluster(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertCampusClusterArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusClustersService.insertCampusCluster(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateCampusClusterMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateCampusClusterArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusClustersService.updateCampusClusterMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteCampusCluster(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteCampusClusterArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusClustersService.deleteCampusCluster(getSelectionSet(info), where);
  }
}

@Resolver('CampusCluster')
export class CampusClustersQueryResolver {
  constructor(private readonly campusClustersService: CampusClustersService) {}

  @Query()
  async campusCluster(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindCampusClusterArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusClustersService.findCampusCluster(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertCampusClusterOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneCampusClusterArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusClustersService.insertCampusClusterOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async campusClusterByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkCampusClusterArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusClustersService.findCampusClusterByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateCampusClusterByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkCampusClusterArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusClustersService.updateCampusClusterByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteCampusClusterByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkCampusClusterArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusClustersService.deleteCampusClusterByPk(getSelectionSet(info), id);
  }
}

@Resolver('CampusClusterAggregate')
export class CampusClustersQueryAggregateResolver {
  constructor(private readonly campusClustersService: CampusClustersService) {}

  @Query()
  async campusClusterAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateCampusClusterArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusClustersService.aggregateCampusCluster(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
