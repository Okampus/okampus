import { IsBoolean, IsString, Length } from 'class-validator';
import { IsFormKitSchema } from '../../../shared/lib/validators/formkit-schema.validator';

export class CreateTeamFormDto {
  @IsString()
  @Length(1, 150)
  name: string;

  @IsString()
  @Length(1, 3000)
  description: string;

  @IsBoolean()
  isTemplate: boolean;

  @IsFormKitSchema()
  form: object;
}
