import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTeamEventValidationDto {
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  message?: string;
}
