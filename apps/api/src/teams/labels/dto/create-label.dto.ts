import { Field } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamLabelType } from '../../../shared/lib/types/enums/team-label-type.enum';

export class CreateLabelDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  id: string;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  image: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  tooltip: string;

  @Field(() => TeamLabelType)
  @IsEnum(TeamLabelType)
  type: TeamLabelType;
}
