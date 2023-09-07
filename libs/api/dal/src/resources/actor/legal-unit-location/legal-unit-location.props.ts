import { Field, InputType, Int } from '@nestjs/graphql';
import { LegalUnitLocationType } from '@okampus/shared/enums';
import { IsEnum, IsInt, IsOptional, IsString, Length, Matches } from 'class-validator';

@InputType()
export class LegalUnitLocationProps {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 100)
  @Matches(/^[\d:a-z-]+$/)
  @IsString()
  slug?: string;

  @Field(() => LegalUnitLocationType)
  @IsEnum(LegalUnitLocationType)
  locationType!: LegalUnitLocationType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  nic?: string | null = null;

  @Field(() => String)
  @IsString()
  legalName!: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  bankInfoLocationCode?: number | null = null;
}
