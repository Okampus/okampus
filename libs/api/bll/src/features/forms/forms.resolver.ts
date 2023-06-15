// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormsService } from './forms.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertOneFormArgsType,
  UpdateByPkFormArgsType,
  FindFormArgsType,
  FindByPkFormArgsType,
  AggregateFormArgsType,
} from './forms.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('Form')
export class FormsQueryResolver {
  constructor(private readonly formsService: FormsService) {}

  @Query()
  async form(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindFormArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formsService.findForm(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertFormOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneFormArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.formsService.insertFormOne(getSelectionSet(info), object, onConflict);
    return data.returning[0];
  }

  @Query()
  async formByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkFormArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formsService.findFormByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateFormByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkFormArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formsService.updateFormByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteFormByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkFormArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formsService.deleteFormByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('FormAggregate')
export class FormsQueryAggregateResolver {
  constructor(private readonly formsService: FormsService) {}

  @Query()
  async formAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateFormArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formsService.aggregateForm(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
