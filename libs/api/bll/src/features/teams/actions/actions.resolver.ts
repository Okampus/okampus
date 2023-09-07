import { ActionsService } from './actions.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteActionArgsType,
  DeleteByPkActionArgsType,
  InsertOneActionArgsType,
  InsertActionArgsType,
  UpdateByPkActionArgsType,
  UpdateActionArgsType,
  FindActionArgsType,
  FindByPkActionArgsType,
  AggregateActionArgsType
} from './actions.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('ActionMutationResponse')
export class ActionsMutationResolver {
  constructor(private readonly actionsService: ActionsService) {}

  @Mutation()
  async insertAction(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.insertAction(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateActionMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateActionArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.updateActionMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteAction(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.deleteAction(getSelectionSet(info), where);
  }
}

@Resolver('Action')
export class ActionsQueryResolver {
  constructor(private readonly actionsService: ActionsService) {}

  @Query()
  async action(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.findAction(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertActionOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.insertActionOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async actionByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.findActionByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateActionByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.updateActionByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteActionByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.deleteActionByPk(getSelectionSet(info), id);
  }
}

@Resolver('ActionAggregate')
export class ActionsQueryAggregateResolver {
  constructor(private readonly actionsService: ActionsService) {}

  @Query()
  async actionAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.aggregateAction(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
