import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class FormSubmissionProps {
  @Field(() => GraphQLJSON)
  // TODO: custom validator
  submission!: JSONObject;
}
