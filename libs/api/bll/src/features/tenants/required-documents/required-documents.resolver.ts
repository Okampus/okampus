import { RequiredDocumentsService } from './required-documents.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteRequiredDocumentArgsType,
  DeleteByPkRequiredDocumentArgsType,
  InsertOneRequiredDocumentArgsType,
  InsertRequiredDocumentArgsType,
  UpdateByPkRequiredDocumentArgsType,
  UpdateRequiredDocumentArgsType,
  FindRequiredDocumentArgsType,
  FindByPkRequiredDocumentArgsType,
  AggregateRequiredDocumentArgsType,
} from './required-documents.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('RequiredDocumentMutationResponse')
export class RequiredDocumentsMutationResolver {
  constructor(private readonly requiredDocumentsService: RequiredDocumentsService) {}

  @Mutation()
  async insertRequiredDocument(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertRequiredDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredDocumentsService.insertRequiredDocument(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateRequiredDocumentMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateRequiredDocumentArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredDocumentsService.updateRequiredDocumentMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteRequiredDocument(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteRequiredDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredDocumentsService.deleteRequiredDocument(getSelectionSet(info), where);
  }
}

@Resolver('RequiredDocument')
export class RequiredDocumentsQueryResolver {
  constructor(private readonly requiredDocumentsService: RequiredDocumentsService) {}

  @Query()
  async requiredDocument(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindRequiredDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredDocumentsService.findRequiredDocument(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertRequiredDocumentOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneRequiredDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredDocumentsService.insertRequiredDocumentOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async requiredDocumentByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkRequiredDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredDocumentsService.findRequiredDocumentByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateRequiredDocumentByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkRequiredDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredDocumentsService.updateRequiredDocumentByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteRequiredDocumentByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkRequiredDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredDocumentsService.deleteRequiredDocumentByPk(getSelectionSet(info), id);
  }
}

@Resolver('RequiredDocumentAggregate')
export class RequiredDocumentsQueryAggregateResolver {
  constructor(private readonly requiredDocumentsService: RequiredDocumentsService) {}

  @Query()
  async requiredDocumentAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateRequiredDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredDocumentsService.aggregateRequiredDocument(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
