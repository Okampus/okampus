// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormsService } from './forms.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertFormArgsType,
  InsertOneFormArgsType,
  UpdateFormArgsType,
  UpdateByPkFormArgsType,
  FindFormArgsType,
  FindByPkFormArgsType,
  AggregateFormArgsType,
} from './forms.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('FormMutationResponse')
export class FormsMutationResolver {
  constructor(private readonly formsService: FormsService) {}

  @Mutation()
  async insertForm(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertFormArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formsService.insertForm(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateForm(@Info() info: GraphQLResolveInfo) {
    const { where, _set } = getGraphQLArgs<UpdateFormArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formsService.updateForm(getSelectionSet(info), where, _set);
  }
}

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
    const data = await this.formsService.insertForm(getSelectionSet(info), [object], onConflict, true);
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
