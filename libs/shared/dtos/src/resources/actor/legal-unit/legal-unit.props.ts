import { Field, InputType, Int } from '@nestjs/graphql';
import { LegalUnitType } from '@okampus/shared/enums';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class LegalUnitProps {
  @Field(() => LegalUnitType)
  @IsEnum(LegalUnitType)
  type!: LegalUnitType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  siren?: string | null = null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  headquartersNic?: string | null = null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  legalCategory?: string | null = null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  activityCategory?: string | null = null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  legalName?: string | null = null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  bankCode?: number | null = null;
}
