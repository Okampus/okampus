import { Field, InputType } from '@nestjs/graphql';
import {
 IsBoolean, IsEnum, IsString, Length,
} from 'class-validator';
import { GraphQLJSON } from 'graphql-scalars';
import { TeamFormType } from '../../../../shared/lib/types/enums/team-form-type.enum';
import { IsFormKitSchema } from '../../../../shared/lib/validators/formkit-schema.validator';

@InputType()
export class CreateTeamFormDto {
  @Field()
  @IsString()
  @Length(1, 150)
  name: string;

  @Field()
  @IsString()
  @Length(0, 3000)
  description: string;

  @Field(() => TeamFormType)
  @IsEnum(TeamFormType)
  type: TeamFormType;

  @Field(() => Boolean)
  @IsBoolean()
  isTemplate: boolean;

  @Field(() => GraphQLJSON)
  @IsFormKitSchema()
  schema: object[] | object;
}
