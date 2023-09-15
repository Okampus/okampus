import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { FormType } from '@okampus/shared/enums';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import type { FormSchema } from '@okampus/shared/types';

@InputType()
export class FormProps {
  @Field(() => GraphQLJSON)
  schema!: FormSchema;

  @Field(() => FormType)
  @IsEnum(FormType)
  type!: FormType;

  @Field(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isAllowingMultipleAnswers?: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isAllowingEditingAnswers?: boolean;
}
