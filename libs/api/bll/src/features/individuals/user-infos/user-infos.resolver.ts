// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserInfosService } from './user-infos.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertUserInfoArgsType,
  InsertOneUserInfoArgsType,
  UpdateUserInfoArgsType,
  UpdateByPkUserInfoArgsType,
  FindUserInfoArgsType,
  FindByPkUserInfoArgsType,
  AggregateUserInfoArgsType,
} from './user-infos.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('UserInfoMutationResponse')
export class UserInfosMutationResolver {
  constructor(private readonly userInfosService: UserInfosService) {}

  @Mutation()
  async insertUserInfo(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertUserInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.userInfosService.insertUserInfo(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateUserInfo(@Info() info: GraphQLResolveInfo) {
    const { where, _set } = getGraphQLArgs<UpdateUserInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.userInfosService.updateUserInfo(getSelectionSet(info), where, _set);
  }
}

@Resolver('UserInfo')
export class UserInfosQueryResolver {
  constructor(private readonly userInfosService: UserInfosService) {}

  @Query()
  async userInfo(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindUserInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.userInfosService.findUserInfo(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertUserInfoOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneUserInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.userInfosService.insertUserInfo(getSelectionSet(info), [object], onConflict, true);
    return data.returning[0];
  }

  @Query()
  async userInfoByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkUserInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.userInfosService.findUserInfoByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateUserInfoByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkUserInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.userInfosService.updateUserInfoByPk(getSelectionSet(info), pkColumns, _set);
  }
}

@Resolver('UserInfoAggregate')
export class UserInfosQueryAggregateResolver {
  constructor(private readonly userInfosService: UserInfosService) {}

  @Query()
  async userInfoAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateUserInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.userInfosService.aggregateUserInfo(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
