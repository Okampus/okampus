import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTeamEventValidationDto {
  @Field(() => Boolean)
  @IsBoolean()
  approved: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  message?: string;
}
