import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { TeamPermissions, TeamRoleCategory } from '@okampus/shared/enums';

@InputType()
export class TeamRoleProps {
  @Field(() => [TeamPermissions])
  @IsEnum(TeamPermissions, { each: true })
  permissions!: TeamPermissions[];

  @Field(() => TeamRoleCategory)
  @IsEnum(TeamRoleCategory)
  category!: TeamRoleCategory;
}
