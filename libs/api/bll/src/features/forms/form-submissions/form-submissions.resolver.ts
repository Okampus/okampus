import { FormSubmissionsService } from './form-submissions.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteFormSubmissionArgsType,
  DeleteByPkFormSubmissionArgsType,
  InsertOneFormSubmissionArgsType,
  InsertFormSubmissionArgsType,
  UpdateByPkFormSubmissionArgsType,
  UpdateFormSubmissionArgsType,
  FindFormSubmissionArgsType,
  FindByPkFormSubmissionArgsType,
  AggregateFormSubmissionArgsType
} from './form-submissions.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('FormSubmissionMutationResponse')
export class FormSubmissionsMutationResolver {
  constructor(private readonly formSubmissionsService: FormSubmissionsService) {}

  @Mutation()
  async insertFormSubmission(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertFormSubmissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formSubmissionsService.insertFormSubmission(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateFormSubmissionMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateFormSubmissionArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formSubmissionsService.updateFormSubmissionMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteFormSubmission(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteFormSubmissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formSubmissionsService.deleteFormSubmission(getSelectionSet(info), where);
  }
}

@Resolver('FormSubmission')
export class FormSubmissionsQueryResolver {
  constructor(private readonly formSubmissionsService: FormSubmissionsService) {}

  @Query()
  async formSubmission(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindFormSubmissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formSubmissionsService.findFormSubmission(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertFormSubmissionOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneFormSubmissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formSubmissionsService.insertFormSubmissionOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async formSubmissionByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkFormSubmissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formSubmissionsService.findFormSubmissionByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateFormSubmissionByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkFormSubmissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formSubmissionsService.updateFormSubmissionByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteFormSubmissionByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkFormSubmissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formSubmissionsService.deleteFormSubmissionByPk(getSelectionSet(info), id);
  }
}

@Resolver('FormSubmissionAggregate')
export class FormSubmissionsQueryAggregateResolver {
  constructor(private readonly formSubmissionsService: FormSubmissionsService) {}

  @Query()
  async formSubmissionAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateFormSubmissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.formSubmissionsService.aggregateFormSubmission(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
