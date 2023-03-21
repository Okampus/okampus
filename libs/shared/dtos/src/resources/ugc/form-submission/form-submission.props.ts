import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { IsArray, IsObject } from 'class-validator';

import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class FormSubmissionProps {
  @Field(() => GraphQLJSON)
  @IsArray()
  @IsObject({ each: true })
  // TODO: custom validator
  submission!: JSONObject;
}
