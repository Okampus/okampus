import {
  Field,
  InputType,
  Int,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { CreateEventRegistrationDto } from '@modules/plan/registrations/dto/create-event-registration.dto';

@InputType()
export class UpdateEventRegistrationDto extends PartialType(
  OmitType(CreateEventRegistrationDto, ['originalFormId', 'formSubmission']),
) {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  present?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  participationScore?: number;
}
