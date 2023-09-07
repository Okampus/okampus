import { LocationsService } from './locations.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteLocationArgsType,
  DeleteByPkLocationArgsType,
  InsertOneLocationArgsType,
  InsertLocationArgsType,
  UpdateByPkLocationArgsType,
  UpdateLocationArgsType,
  FindLocationArgsType,
  FindByPkLocationArgsType,
  AggregateLocationArgsType
} from './locations.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('LocationMutationResponse')
export class LocationsMutationResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Mutation()
  async insertLocation(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.locationsService.insertLocation(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateLocationMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateLocationArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.locationsService.updateLocationMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteLocation(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.locationsService.deleteLocation(getSelectionSet(info), where);
  }
}

@Resolver('Location')
export class LocationsQueryResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query()
  async location(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.locationsService.findLocation(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertLocationOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.locationsService.insertLocationOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async locationByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.locationsService.findLocationByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateLocationByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.locationsService.updateLocationByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteLocationByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.locationsService.deleteLocationByPk(getSelectionSet(info), id);
  }
}

@Resolver('LocationAggregate')
export class LocationsQueryAggregateResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query()
  async locationAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.locationsService.aggregateLocation(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
