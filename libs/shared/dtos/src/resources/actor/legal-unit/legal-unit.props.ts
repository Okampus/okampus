import { Field, InputType } from '@nestjs/graphql';
import { LegalUnitType } from '@okampus/shared/enums';
import { IsEnum, IsString } from 'class-validator';

@InputType()
export class LegalUnitProps {
  @Field(() => LegalUnitType)
  @IsEnum(LegalUnitType)
  type!: LegalUnitType;

  @Field(() => String)
  @IsString()
  name!: string;
}
