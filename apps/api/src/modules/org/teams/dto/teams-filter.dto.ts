import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { TeamKind } from '@meta/shared/lib/types/enums/team-kind.enum';

@InputType()
export class TeamsFilterDto {
  @Field(() => TeamKind)
  @IsOptional()
  @IsEnum(TeamKind)
  kind?: TeamKind;
}
