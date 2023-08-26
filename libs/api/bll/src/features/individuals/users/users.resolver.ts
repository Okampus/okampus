import { UsersService } from './users.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteUserArgsType,
  DeleteByPkUserArgsType,
  InsertOneUserArgsType,
  InsertUserArgsType,
  UpdateByPkUserArgsType,
  UpdateUserArgsType,
  FindUserArgsType,
  FindByPkUserArgsType,
  AggregateUserArgsType,
} from './users.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('UserMutationResponse')
export class UsersMutationResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation()
  async insertUser(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertUserArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.usersService.insertUser(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateUserMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateUserArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.usersService.updateUserMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteUser(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteUserArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.usersService.deleteUser(getSelectionSet(info), where);
  }
}

@Resolver('User')
export class UsersQueryResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  async user(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindUserArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.usersService.findUser(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertUserOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneUserArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.usersService.insertUserOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async userByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkUserArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.usersService.findUserByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateUserByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkUserArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.usersService.updateUserByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteUserByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkUserArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.usersService.deleteUserByPk(getSelectionSet(info), id);
  }
}

@Resolver('UserAggregate')
export class UsersQueryAggregateResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  async userAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateUserArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.usersService.aggregateUser(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
