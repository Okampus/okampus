import { Field, InputType, Int } from '@nestjs/graphql';
import { LegalUnitLocationType } from '@okampus/shared/enums';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class LegalUnitLocationProps {
  @Field(() => LegalUnitLocationType)
  @IsEnum(LegalUnitLocationType)
  locationType!: LegalUnitLocationType;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  nic?: string | null = null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  legalName?: string | null = null;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  bankLocationCode?: number | null = null;
}
