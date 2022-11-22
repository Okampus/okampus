import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class CreateReportDto {
  @Field()
  @Length(10, 2000)
  @IsString()
  @IsOptional()
  reason?: string;
}
