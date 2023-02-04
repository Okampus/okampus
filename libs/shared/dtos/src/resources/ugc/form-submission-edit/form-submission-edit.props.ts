import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import type { JSONObject } from '@okampus/shared/types';
import { IsDiff } from '../../../validators/diff.validator';

@InputType()
export class FormSubmissionEditProps {
  @Field(() => GraphQLJSON)
  @IsDiff()
  addedDiff!: JSONObject;
}
