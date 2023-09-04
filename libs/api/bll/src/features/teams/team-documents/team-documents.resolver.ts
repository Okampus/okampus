import { TeamDocumentsService } from './team-documents.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTeamDocumentArgsType,
  DeleteByPkTeamDocumentArgsType,
  InsertOneTeamDocumentArgsType,
  InsertTeamDocumentArgsType,
  UpdateByPkTeamDocumentArgsType,
  UpdateTeamDocumentArgsType,
  FindTeamDocumentArgsType,
  FindByPkTeamDocumentArgsType,
  AggregateTeamDocumentArgsType
} from './team-documents.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TeamDocumentMutationResponse')
export class TeamDocumentsMutationResolver {
  constructor(private readonly teamDocumentsService: TeamDocumentsService) {}

  @Mutation()
  async insertTeamDocument(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTeamDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamDocumentsService.insertTeamDocument(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTeamDocumentMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTeamDocumentArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamDocumentsService.updateTeamDocumentMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTeamDocument(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTeamDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamDocumentsService.deleteTeamDocument(getSelectionSet(info), where);
  }
}

@Resolver('TeamDocument')
export class TeamDocumentsQueryResolver {
  constructor(private readonly teamDocumentsService: TeamDocumentsService) {}

  @Query()
  async teamDocument(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTeamDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamDocumentsService.findTeamDocument(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertTeamDocumentOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTeamDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamDocumentsService.insertTeamDocumentOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async teamDocumentByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkTeamDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamDocumentsService.findTeamDocumentByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateTeamDocumentByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTeamDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamDocumentsService.updateTeamDocumentByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTeamDocumentByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTeamDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamDocumentsService.deleteTeamDocumentByPk(getSelectionSet(info), id);
  }
}

@Resolver('TeamDocumentAggregate')
export class TeamDocumentsQueryAggregateResolver {
  constructor(private readonly teamDocumentsService: TeamDocumentsService) {}

  @Query()
  async teamDocumentAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTeamDocumentArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamDocumentsService.aggregateTeamDocument(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
