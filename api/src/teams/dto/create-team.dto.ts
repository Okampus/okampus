import { IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  icon: string;
}
