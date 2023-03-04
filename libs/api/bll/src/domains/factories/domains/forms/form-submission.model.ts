import { FormModel } from './form.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { UgcModel } from '../../abstract/ugc.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import type { IFormEdit, IFormSubmission } from '@okampus/shared/dtos';
import type { JSONObject } from '@okampus/shared/types';

@ObjectType({ implements: () => [UgcModel] })
export class FormSubmissionModel extends UgcModel implements IFormSubmission {
  @Field(() => GraphQLJSON)
  submission!: JSONObject;

  @Field(() => FormModel, { nullable: true })
  linkedFormVersion?: IFormEdit;

  constructor(form: IFormSubmission) {
    super(form);
    this.assign(form);
  }
}

@ObjectType()
export class PaginatedFormSubmissionModel extends Paginated(FormSubmissionModel) {}
