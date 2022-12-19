import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';
import { EventRegistrationStatus } from '@lib/types/enums/event-register-status.enum';

@InputType()
export class CreateEventRegistrationDto {
  @Field(() => EventRegistrationStatus)
  @IsEnum(EventRegistrationStatus)
  status!: EventRegistrationStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  originalFormId?: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  formSubmission?: object[] | object;
}
