// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActionsService } from './actions.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertActionArgsType,
  InsertOneActionArgsType,
  UpdateActionArgsType,
  UpdateByPkActionArgsType,
  FindActionArgsType,
  FindByPkActionArgsType,
  AggregateActionArgsType,
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
  async updateAction(@Info() info: GraphQLResolveInfo) {
    const { where, _set } = getGraphQLArgs<UpdateActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.updateAction(getSelectionSet(info), where, _set);
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
    const data = await this.actionsService.insertAction(getSelectionSet(info), [object], onConflict, true);
    return data.returning[0];
  }

  @Query()
  async actionByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkActionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actionsService.findActionByPk(getSelectionSet(info), id);
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
    return await this.actionsService.aggregateAction(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}