import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { TeamKind } from '@common/lib/types/enums/team-kind.enum';

// TODO: no TeamImage on create
@InputType()
export class CreateTeamDto {
  @Field()
  @IsString()
  name: string;

  @Field(() => TeamKind)
  @IsEnum(TeamKind)
  kind: TeamKind;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  longDescription?: string;

  @Field()
  @IsString()
  category: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[] = [];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  presentationVideo?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logo?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logoDark?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  banner?: string;
}
