import { IsDiff } from '../../../validators/diff.validator';
import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class FormSubmissionEditProps {
  @Field(() => GraphQLJSON)
  @IsDiff()
  addedDiff!: JSONObject;
}
