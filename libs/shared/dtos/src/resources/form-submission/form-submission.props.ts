import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { IsObject } from 'class-validator';
import type { FormSchema, Submission } from '@okampus/shared/types';

@InputType()
export class FormSubmissionProps {
  @Field(() => GraphQLJSON)
  @IsObject()
  // TODO: custom validator
  submission!: Submission<FormSchema>;
}
