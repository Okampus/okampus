import { TeamRoleFilterQuery } from './team-role.filter-query';
import { TeamFilterQuery } from '../teams/team.filter-query';

import { ScopeRole } from '@okampus/shared/enums';
import { Field, InputType } from '@nestjs/graphql';

import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class UserFilterQuery {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  ids?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  slugs?: string[];

  @Field(() => [ScopeRole], { nullable: true })
  @IsOptional()
  @IsEnum(ScopeRole, { each: true })
  scopeRoles?: ScopeRole[];

  @Field(() => TeamFilterQuery, { nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => TeamFilterQuery)
  teamMemberships?: TeamFilterQuery;

  @Field(() => TeamRoleFilterQuery, { nullable: true })
  @IsOptional()
  @IsEnum(TeamRoleFilterQuery, { each: true })
  teamRoles?: TeamRoleFilterQuery;
}
