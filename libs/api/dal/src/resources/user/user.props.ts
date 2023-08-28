import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UserProps {
  @Field(() => String)
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => String)
  @IsString()
  firstName!: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  middleNames?: string[];

  @Field(() => String)
  @IsString()
  lastName!: string;
}
