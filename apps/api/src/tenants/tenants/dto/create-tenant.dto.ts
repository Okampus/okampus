import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTenantDto {
  @Field()
  @IsOptional()
  @IsString()
  id: string;
}
