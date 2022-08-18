import {
 IsBoolean, IsEnum, IsString, Length,
} from 'class-validator';
import { TeamFormType } from '../../../shared/lib/types/enums/team-form-type.enum';
import { IsFormKitSchema } from '../../../shared/lib/validators/formkit-schema.validator';

export class CreateTeamFormDto {
  @IsString()
  @Length(1, 150)
  name: string;

  @IsString()
  @Length(1, 3000)
  description: string;

  @IsEnum(TeamFormType)
  type: TeamFormType;

  @IsBoolean()
  isTemplate: boolean;

  @IsFormKitSchema()
  form: object[] | object;
}
