import { Field, ObjectType } from '@nestjs/graphql';
import type { IForm, IFormSubmission } from '@okampus/shared/dtos';
import type { JSONObject } from '@okampus/shared/types';
import { GraphQLJSON } from 'graphql-scalars';
import { Paginated } from '../../../../shards/types/paginated.type';
import { UgcModel } from '../../abstract/ugc.model';
import { FormModel } from './form.model';

@ObjectType({ implements: () => [UgcModel] })
export class FormSubmissionModel extends UgcModel implements IFormSubmission {
  @Field(() => GraphQLJSON)
  submission!: JSONObject;

  @Field(() => FormModel, { nullable: true })
  forForm?: IForm;

  constructor(form: IFormSubmission) {
    super(form);
    this.assign(form);
  }
}

@ObjectType()
export class PaginatedFormSubmissionModel extends Paginated(FormSubmissionModel) {}
