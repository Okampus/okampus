import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { ValidationType } from '@okampus/shared/enums';

@InputType()
export class ValidationProps {
  @Field(() => ValidationType)
  @IsEnum(ValidationType)
  type!: ValidationType;
}
