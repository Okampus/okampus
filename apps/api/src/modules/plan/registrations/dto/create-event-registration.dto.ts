import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';
import { EventRegisterStatus } from '@common/lib/types/enums/event-register-status.enum';

@InputType()
export class CreateEventRegistrationDto {
  @Field(() => EventRegisterStatus)
  @IsEnum(EventRegisterStatus)
  status!: EventRegisterStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  originalFormId?: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  formSubmission?: object[] | object;
}
