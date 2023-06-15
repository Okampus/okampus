// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserInfosService } from './user-infos.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertOneUserInfoArgsType,
  UpdateByPkUserInfoArgsType,
  FindUserInfoArgsType,
  FindByPkUserInfoArgsType,
  AggregateUserInfoArgsType,
} from './user-infos.types';

import type { GraphQLResolveInfo } from 'graphql';

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
    const data = await this.userInfosService.insertUserInfoOne(getSelectionSet(info), object, onConflict);
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

  @Mutation()
  async deleteUserInfoByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkUserInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.userInfosService.deleteUserInfoByPk(getSelectionSet(info), pkColumns);
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
