import { TeamFilterQuery } from '../teams/team.filter-query';
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TeamPermissions, TeamRoleCategory, TeamRoleKey } from '@okampus/shared/enums';

@InputType()
export class TeamRoleFilterQuery {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  ids?: string[];

  @Field(() => TeamFilterQuery, { nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => TeamFilterQuery)
  teams?: TeamFilterQuery;

  @Field(() => [TeamPermissions], { nullable: true })
  @IsOptional()
  @IsEnum(TeamPermissions, { each: true })
  permissionsAll?: TeamPermissions[];

  @Field(() => [TeamPermissions], { nullable: true })
  @IsOptional()
  @IsEnum(TeamPermissions, { each: true })
  permissionsSome?: TeamPermissions[];

  @Field(() => [TeamRoleCategory], { nullable: true })
  @IsOptional()
  @IsEnum(TeamRoleCategory, { each: true })
  categories?: TeamRoleCategory[];

  @Field(() => [TeamRoleKey], { nullable: true })
  @IsOptional()
  @IsEnum(TeamRoleKey, { each: true })
  keys?: TeamRoleKey[];
}
