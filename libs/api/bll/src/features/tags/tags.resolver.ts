import { TagsService } from './tags.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTagArgsType,
  DeleteByPkTagArgsType,
  InsertOneTagArgsType,
  InsertTagArgsType,
  UpdateByPkTagArgsType,
  UpdateTagArgsType,
  FindTagArgsType,
  FindByPkTagArgsType,
  AggregateTagArgsType
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
  async updateTagMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTagArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.updateTagMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTag(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.deleteTag(getSelectionSet(info), where);
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
    return await this.tagsService.insertTagOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async tagByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.findTagByPk(getSelectionSet(info),  id, );
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

  @Mutation()
  async deleteTagByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tagsService.deleteTagByPk(getSelectionSet(info), id);
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
    return await this.tagsService.aggregateTag(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
