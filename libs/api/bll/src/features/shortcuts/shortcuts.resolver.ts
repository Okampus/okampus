import { ShortcutsService } from './shortcuts.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteShortcutArgsType,
  DeleteByPkShortcutArgsType,
  InsertOneShortcutArgsType,
  InsertShortcutArgsType,
  UpdateByPkShortcutArgsType,
  UpdateShortcutArgsType,
  FindShortcutArgsType,
  FindByPkShortcutArgsType,
  AggregateShortcutArgsType,
} from './shortcuts.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('ShortcutMutationResponse')
export class ShortcutsMutationResolver {
  constructor(private readonly shortcutsService: ShortcutsService) {}

  @Mutation()
  async insertShortcut(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertShortcutArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.shortcutsService.insertShortcut(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateShortcutMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateShortcutArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.shortcutsService.updateShortcutMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteShortcut(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteShortcutArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.shortcutsService.deleteShortcut(getSelectionSet(info), where);
  }
}

@Resolver('Shortcut')
export class ShortcutsQueryResolver {
  constructor(private readonly shortcutsService: ShortcutsService) {}

  @Query()
  async shortcut(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindShortcutArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.shortcutsService.findShortcut(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertShortcutOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneShortcutArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.shortcutsService.insertShortcutOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async shortcutByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkShortcutArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.shortcutsService.findShortcutByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateShortcutByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkShortcutArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.shortcutsService.updateShortcutByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteShortcutByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkShortcutArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.shortcutsService.deleteShortcutByPk(getSelectionSet(info), id);
  }
}

@Resolver('ShortcutAggregate')
export class ShortcutsQueryAggregateResolver {
  constructor(private readonly shortcutsService: ShortcutsService) {}

  @Query()
  async shortcutAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateShortcutArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.shortcutsService.aggregateShortcut(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
