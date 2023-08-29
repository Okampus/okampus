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

  @Field(() => String)
  @IsString()
  legalName!: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  bankInfoLocationCode?: number | null = null;
}
