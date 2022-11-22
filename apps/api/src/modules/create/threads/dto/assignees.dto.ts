import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class AssigneesDto {
  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  assignedTeams: number[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  assignedUsers: string[];
}
