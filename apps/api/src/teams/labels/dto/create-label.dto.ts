import { Field } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamLabelType } from '../../../shared/lib/types/enums/team-label-type.enum';

export class CreateLabelDto {
  @IsOptional()
  @IsString()
  slug: string;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @IsString()
  tooltip: string;

  @Field(() => TeamLabelType)
  @IsEnum(TeamLabelType)
  type: TeamLabelType;
}
