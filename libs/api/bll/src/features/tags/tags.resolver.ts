// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TagsService } from './tags.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertTagArgsType,
  InsertOneTagArgsType,
  UpdateTagArgsType,
  UpdateByPkTagArgsType,
  FindTagArgsType,
  FindByPkTagArgsType,
  AggregateTagArgsType,
} from './tags.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TagMutationResponse')
export class TagsMutationResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Mutation()
  async insertTag(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.insertTag(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTag(@Info() info: GraphQLResolveInfo) {
    const { where, _set } = getGraphQLArgs<UpdateTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.updateTag(getSelectionSet(info), where, _set);
  }
}

@Resolver('Tag')
export class TagsQueryResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query()
  async tag(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.findTag(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertTagOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.tagsService.insertTag(getSelectionSet(info), [object], onConflict, true);
    return data.returning[0];
  }

  @Query()
  async tagByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.findTagByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateTagByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.updateTagByPk(getSelectionSet(info), pkColumns, _set);
  }
}

@Resolver('TagAggregate')
export class TagsQueryAggregateResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query()
  async tagAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.aggregateTag(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
