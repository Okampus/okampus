import { SocialsService } from './socials.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteSocialArgsType,
  InsertOneSocialArgsType,
  InsertSocialArgsType,
  UpdateByPkSocialArgsType,
  UpdateSocialArgsType,
  FindSocialArgsType,
  FindByPkSocialArgsType,
  AggregateSocialArgsType,
} from './socials.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('SocialMutationResponse')
export class SocialsMutationResolver {
  constructor(private readonly socialsService: SocialsService) {}

  @Mutation()
  async insertSocial(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertSocialArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.socialsService.insertSocial(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateSocialMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateSocialArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.socialsService.updateSocialMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteSocial(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteSocialArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.socialsService.deleteSocial(getSelectionSet(info), where);
  }
}

@Resolver('Social')
export class SocialsQueryResolver {
  constructor(private readonly socialsService: SocialsService) {}

  @Query()
  async social(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindSocialArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.socialsService.findSocial(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertSocialOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneSocialArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.socialsService.insertSocialOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async socialByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkSocialArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.socialsService.findSocialByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateSocialByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkSocialArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.socialsService.updateSocialByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteSocialByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkSocialArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.socialsService.deleteSocialByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('SocialAggregate')
export class SocialsQueryAggregateResolver {
  constructor(private readonly socialsService: SocialsService) {}

  @Query()
  async socialAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateSocialArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.socialsService.aggregateSocial(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
