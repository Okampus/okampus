import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { FormType } from '@okampus/shared/enums';
import { IsBoolean, IsEnum, IsOptional, IsString, Length } from 'class-validator';

import type { FormField } from '@okampus/shared/types';

@InputType()
export class FormProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => GraphQLJSON)
  schema!: FormField[];

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
