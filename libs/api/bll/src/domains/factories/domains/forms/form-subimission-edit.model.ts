/* eslint-disable import/no-cycle */
import { EditModel, FormEditModel, FormSubmissionModel, UgcModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { Field, ObjectType } from '@nestjs/graphql';

import { GraphQLJSON } from 'graphql-scalars';

import type { JSONObject } from '@okampus/shared/types';
import type { IFormSubmissionEdit } from '@okampus/shared/dtos';

@ObjectType({ implements: () => [UgcModel] })
export class FormSubmissionEditModel extends EditModel implements IFormSubmissionEdit {
  @Field(() => GraphQLJSON)
  newVersion!: JSONObject;

  @Field(() => FormEditModel)
  linkedFormEdit!: FormEditModel;

  constructor(formEdit: IFormSubmissionEdit) {
    super(formEdit);
    this.assign(formEdit);
  }
}

@ObjectType()
export class PaginatedFormSubmissionModel extends Paginated(FormSubmissionModel) {}
