import { Field, InputType } from '@nestjs/graphql';
import { TeamType } from '@okampus/shared/enums';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class TeamFilterQuery {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ids?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  slugs?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @Field(() => [TeamType], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(TeamType, { each: true })
  types?: TeamType[];
}
