import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class UserInfoProps {
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
