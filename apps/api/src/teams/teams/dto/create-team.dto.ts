import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { URLResolver } from 'graphql-scalars';
import { TeamKind } from '../../../shared/lib/types/enums/team-kind.enum';

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

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  banner?: string;

  @Field(() => URLResolver, { nullable: true })
  @IsOptional()
  @IsUrl()
  membershipRequestLink?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  membershipRequestMessage?: string;
}
