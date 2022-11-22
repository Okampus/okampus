import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamRole } from '@meta/shared/lib/types/enums/team-role.enum';

@InputType()
export class UpdateTeamMemberDto {
  @Field(() => TeamRole, { nullable: true })
  @IsOptional()
  @IsEnum(TeamRole)
  role?: TeamRole;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  roleLabel?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  transferTo?: string;
}
