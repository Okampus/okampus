import { DocumentsService } from './documents.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteDocumentArgsType,
  DeleteByPkDocumentArgsType,
  InsertOneDocumentArgsType,
  InsertDocumentArgsType,
  UpdateByPkDocumentArgsType,
  UpdateDocumentArgsType,
  FindDocumentArgsType,
  FindByPkDocumentArgsType,
  AggregateDocumentArgsType,
} from './documents.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('DocumentMutationResponse')
export class DocumentsMutationResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Mutation()
  async insertDocument(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.documentsService.insertDocument(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateDocumentMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateDocumentArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.documentsService.updateDocumentMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteDocument(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.documentsService.deleteDocument(getSelectionSet(info), where);
  }
}

@Resolver('Document')
export class DocumentsQueryResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Query()
  async document(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.documentsService.findDocument(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertDocumentOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.documentsService.insertDocumentOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async documentByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.documentsService.findDocumentByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateDocumentByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.documentsService.updateDocumentByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteDocumentByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.documentsService.deleteDocumentByPk(getSelectionSet(info), id);
  }
}

@Resolver('DocumentAggregate')
export class DocumentsQueryAggregateResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Query()
  async documentAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.documentsService.aggregateDocument(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
